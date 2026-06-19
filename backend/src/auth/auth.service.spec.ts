import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken, getConnectionToken } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { Types } from 'mongoose'
import * as bcrypt from 'bcryptjs'

import { AuthService } from './auth.service'
import { User } from '../users/schemas/user.schema'
import { Organization } from '../organizations/schemas/organization.schema'
import { OrganizationsService } from '../organizations/organizations.service'

/* ── Mock global de bcryptjs ─────────────────────────────────────────────
   On évite les vraies opérations de hashing (~80ms/call) en test.         */
jest.mock('bcryptjs')
const bcryptMock = bcrypt as jest.Mocked<typeof bcrypt>

/* ── Fixtures ──────────────────────────────────────────────────────────── */
const UID = new Types.ObjectId()
const OID = new Types.ObjectId()

const MOCK_ORG = {
  _id:        OID,
  name:       'Acme Corp',
  type:       'Entreprise' as const,
  ownerId:    UID,
  inviteCode: 'ABCD-1234',
}

const MOCK_USER = {
  _id:            UID,
  first_name:     'Jean',
  last_name:      'Dupont',
  email:          'jean@test.com',
  password:       '$hashed$',
  role:           'owner' as const,
  organizationId: OID,
  refreshToken:   '$rt_hashed$',
}

const MOCK_MEMBER = {
  ...MOCK_USER,
  _id:   new Types.ObjectId(),
  email: 'marie@test.com',
  role:  'member' as const,
}

/* ── Helpers ───────────────────────────────────────────────────────────── */
const execMock  = (value: unknown) => ({ exec: jest.fn().mockResolvedValue(value) })

/* ── Suite ─────────────────────────────────────────────────────────────── */
describe('AuthService', () => {
  let service: AuthService

  /* Mocks partagés, réinitialisés avant chaque test */
  let userModel: {
    exists:            jest.Mock
    create:            jest.Mock
    findOne:           jest.Mock
    findById:          jest.Mock
    findByIdAndUpdate: jest.Mock
  }

  let orgModel: {
    create: jest.Mock
  }

  let orgsService: {
    generateUniqueInviteCode: jest.Mock
    findByInviteCode:         jest.Mock
  }

  let jwtService: {
    signAsync:   jest.Mock
    verifyAsync: jest.Mock
  }

  let configService: { getOrThrow: jest.Mock }

  const mockSession = {
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    abortTransaction:  jest.fn(),
    endSession:        jest.fn(),
  }

  const mockConnection = {
    startSession: jest.fn().mockResolvedValue(mockSession),
  }

  beforeEach(async () => {
    /* Réinitialisation complète des mocks */
    jest.clearAllMocks()

    bcryptMock.hash.mockResolvedValue('$hashed$' as never)
    bcryptMock.compare.mockResolvedValue(true as never)

    userModel = {
      exists:            jest.fn().mockResolvedValue(null),
      create:            jest.fn(),
      findOne:           jest.fn(),
      findById:          jest.fn(),
      findByIdAndUpdate: jest.fn().mockResolvedValue(MOCK_USER),
    }

    orgModel = {
      create: jest.fn().mockResolvedValue([MOCK_ORG]),
    }

    orgsService = {
      generateUniqueInviteCode: jest.fn().mockResolvedValue('ABCD-1234'),
      findByInviteCode:         jest.fn().mockResolvedValue(MOCK_ORG),
    }

    jwtService = {
      signAsync:   jest.fn().mockResolvedValue('mock-access-token'),
      verifyAsync: jest.fn(),
    }

    configService = {
      getOrThrow: jest.fn().mockReturnValue('test-secret'),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(User.name),         useValue: userModel },
        { provide: getModelToken(Organization.name), useValue: orgModel },
        { provide: getConnectionToken(),             useValue: mockConnection },
        { provide: OrganizationsService,             useValue: orgsService },
        { provide: JwtService,                       useValue: jwtService },
        { provide: ConfigService,                    useValue: configService },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  // ══════════════════════════════════════════════════════════════════════
  // registerOwner
  // ══════════════════════════════════════════════════════════════════════
  describe('registerOwner', () => {
    const dto = {
      first_name: 'Jean',
      last_name:  'Dupont',
      email:      'jean@test.com',
      password:   'Password123',
      orgName:    'Acme Corp',
      orgType:    'Entreprise' as const,
    }

    beforeEach(() => {
      userModel.create.mockResolvedValue([MOCK_USER])
    })

    it('retourne access_token, refresh_token et les infos utilisateur', async () => {
      const result = await service.registerOwner(dto)

      expect(result).toMatchObject({
        access_token:  'mock-access-token',
        refresh_token: 'mock-access-token',
        user: {
          email: 'jean@test.com',
          role:  'owner',
        },
      })
    })

    it('délègue la génération du code d\'invitation à OrganizationsService', async () => {
      await service.registerOwner(dto)

      expect(orgsService.generateUniqueInviteCode).toHaveBeenCalledTimes(1)
    })

    it('stocke le refresh token hashé en base après la création', async () => {
      await service.registerOwner(dto)

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ refreshToken: '$hashed$' }),
      )
    })

    it('ouvre et valide une transaction MongoDB', async () => {
      await service.registerOwner(dto)

      expect(mockSession.startTransaction).toHaveBeenCalledTimes(1)
      expect(mockSession.commitTransaction).toHaveBeenCalledTimes(1)
    })

    it('lève ConflictException si l\'email est déjà utilisé', async () => {
      userModel.exists.mockResolvedValue({ _id: UID })

      await expect(service.registerOwner(dto)).rejects.toThrow(ConflictException)
    })

    it('annule la transaction et propage l\'erreur en cas d\'échec DB', async () => {
      orgModel.create.mockRejectedValue(new Error('DB write error'))

      await expect(service.registerOwner(dto)).rejects.toThrow('DB write error')
      expect(mockSession.abortTransaction).toHaveBeenCalledTimes(1)
      expect(mockSession.endSession).toHaveBeenCalledTimes(1)
    })
  })

  // ══════════════════════════════════════════════════════════════════════
  // registerMember
  // ══════════════════════════════════════════════════════════════════════
  describe('registerMember', () => {
    const dto = {
      first_name:  'Marie',
      last_name:   'Curie',
      email:       'marie@test.com',
      password:    'Password123',
      inviteCode:  'ABCD-1234',
    }

    beforeEach(() => {
      userModel.create.mockResolvedValue(MOCK_MEMBER)
    })

    it('crée un utilisateur avec le role member et retourne les tokens', async () => {
      const result = await service.registerMember(dto)

      expect(result.user.role).toBe('member')
      expect(result.access_token).toBe('mock-access-token')
    })

    it('rattache l\'utilisateur à l\'organisation du code', async () => {
      await service.registerMember(dto)

      expect(orgsService.findByInviteCode).toHaveBeenCalledWith('ABCD-1234')
    })

    it('lève NotFoundException si le code d\'invitation est invalide', async () => {
      orgsService.findByInviteCode.mockResolvedValue(null)

      await expect(service.registerMember(dto)).rejects.toThrow(NotFoundException)
    })

    it('lève ConflictException si l\'email est déjà utilisé', async () => {
      userModel.exists.mockResolvedValue({ _id: new Types.ObjectId() })

      await expect(service.registerMember(dto)).rejects.toThrow(ConflictException)
    })
  })

  // ══════════════════════════════════════════════════════════════════════
  // login
  // ══════════════════════════════════════════════════════════════════════
  describe('login', () => {
    const dto = { email: 'jean@test.com', password: 'Password123' }

    beforeEach(() => {
      userModel.findOne.mockReturnValue(execMock(MOCK_USER))
    })

    it('retourne les tokens et les infos utilisateur pour des identifiants valides', async () => {
      const result = await service.login(dto)

      expect(result.user.email).toBe('jean@test.com')
      expect(result.access_token).toBeDefined()
      expect(result.refresh_token).toBeDefined()
    })

    it('génère deux tokens distincts (access + refresh)', async () => {
      jwtService.signAsync
        .mockResolvedValueOnce('access-token-value')
        .mockResolvedValueOnce('refresh-token-value')

      const result = await service.login(dto)

      expect(result.access_token).toBe('access-token-value')
      expect(result.refresh_token).toBe('refresh-token-value')
    })

    it('lève UnauthorizedException si le mot de passe est incorrect', async () => {
      bcryptMock.compare.mockResolvedValue(false as never)

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException)
    })

    it('lève UnauthorizedException si l\'utilisateur n\'existe pas', async () => {
      userModel.findOne.mockReturnValue(execMock(null))

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException)
    })

    it('ne distingue pas "mauvais mdp" et "utilisateur inexistant" (message identique)', async () => {
      userModel.findOne.mockReturnValue(execMock(null))
      const errNoUser = await service.login(dto).catch((e: Error) => e.message)

      userModel.findOne.mockReturnValue(execMock(MOCK_USER))
      bcryptMock.compare.mockResolvedValue(false as never)
      const errBadPwd = await service.login(dto).catch((e: Error) => e.message)

      expect(errNoUser).toBe(errBadPwd)
    })
  })

  // ══════════════════════════════════════════════════════════════════════
  // refreshToken
  // ══════════════════════════════════════════════════════════════════════
  describe('refreshToken', () => {
    const jwtPayload = {
      sub:            UID.toString(),
      email:          'jean@test.com',
      role:           'owner',
      organizationId: OID.toString(),
    }

    beforeEach(() => {
      jwtService.verifyAsync.mockResolvedValue(jwtPayload)
      userModel.findById.mockReturnValue(execMock(MOCK_USER))
      bcryptMock.compare.mockResolvedValue(true as never)
    })

    it('retourne un nouvel access_token si le refresh token est valide', async () => {
      const result = await service.refreshToken('valid-refresh-token')

      expect(result.access_token).toBeDefined()
      expect(jwtService.signAsync).toHaveBeenCalledTimes(1)
    })

    it('lève UnauthorizedException si le token est expiré (JWT invalide)', async () => {
      jwtService.verifyAsync.mockRejectedValue(new Error('jwt expired'))

      await expect(service.refreshToken('expired-token')).rejects.toThrow(UnauthorizedException)
    })

    it('lève UnauthorizedException si la session est expirée (refreshToken null en base)', async () => {
      userModel.findById.mockReturnValue(execMock({ ...MOCK_USER, refreshToken: null }))

      await expect(service.refreshToken('orphan-token')).rejects.toThrow(UnauthorizedException)
    })

    it('lève UnauthorizedException si le token ne correspond pas au hash stocké (révoqué)', async () => {
      bcryptMock.compare.mockResolvedValue(false as never)

      await expect(service.refreshToken('revoked-token')).rejects.toThrow(UnauthorizedException)
    })
  })

  // ══════════════════════════════════════════════════════════════════════
  // logout
  // ══════════════════════════════════════════════════════════════════════
  describe('logout', () => {
    it('met refreshToken à null en base', async () => {
      await service.logout(UID.toString())

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        UID.toString(),
        { refreshToken: null },
      )
    })

    it('retourne un message de confirmation', async () => {
      const result = await service.logout(UID.toString())

      expect(result.message).toBeDefined()
      expect(typeof result.message).toBe('string')
    })
  })
})
