import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import { Types } from 'mongoose'

import { OrganizationsService } from './organizations.service'
import { Organization } from './schemas/organization.schema'

/* ── Fixtures ──────────────────────────────────────────────────────────── */
const UID = new Types.ObjectId()
const OID = new Types.ObjectId()

const MOCK_ORG = {
  _id:        OID,
  name:       'Acme Corp',
  type:       'Entreprise' as const,
  ownerId:    UID,
  inviteCode: 'ABCD-1234',
  createdAt:  new Date(),
}

/* ── Suite ─────────────────────────────────────────────────────────────── */
describe('OrganizationsService', () => {
  let service: OrganizationsService
  let orgModel: {
    create:            jest.Mock
    findOne:           jest.Mock
    findById:          jest.Mock
    findByIdAndUpdate: jest.Mock
    exists:            jest.Mock
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    orgModel = {
      create:            jest.fn().mockResolvedValue(MOCK_ORG),
      findOne:           jest.fn(),
      findById:          jest.fn(),
      findByIdAndUpdate: jest.fn(),
      exists:            jest.fn().mockResolvedValue(null), // code libre par défaut
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationsService,
        { provide: getModelToken(Organization.name), useValue: orgModel },
      ],
    }).compile()

    service = module.get<OrganizationsService>(OrganizationsService)
  })

  // ══════════════════════════════════════════════════════════════════════
  // generateUniqueInviteCode
  // ══════════════════════════════════════════════════════════════════════
  describe('generateUniqueInviteCode', () => {
    it('génère un code au format XXXX-XXXX (4 alphanum + tiret + 4 alphanum)', async () => {
      const code = await service.generateUniqueInviteCode()

      expect(code).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/)
    })

    it('chaque appel génère un code différent (entropie suffisante)', async () => {
      const codes = new Set<string>()

      for (let i = 0; i < 20; i++) {
        codes.add(await service.generateUniqueInviteCode())
      }

      /* Sur 20 appels on attend au minimum 15 codes distincts */
      expect(codes.size).toBeGreaterThanOrEqual(15)
    })

    it('boucle et régénère si le premier code est déjà pris', async () => {
      /* Premier exists → code pris (truthy) ; deuxième → libre (null) */
      orgModel.exists
        .mockResolvedValueOnce({ _id: OID })
        .mockResolvedValueOnce(null)

      const code = await service.generateUniqueInviteCode()

      expect(code).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/)
      expect(orgModel.exists).toHaveBeenCalledTimes(2)
    })

    it('continue de boucler tant que des collisions existent', async () => {
      /* 3 collisions consécutives avant d'obtenir un code libre */
      orgModel.exists
        .mockResolvedValueOnce({ _id: OID })
        .mockResolvedValueOnce({ _id: OID })
        .mockResolvedValueOnce({ _id: OID })
        .mockResolvedValueOnce(null)

      const code = await service.generateUniqueInviteCode()

      expect(code).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/)
      expect(orgModel.exists).toHaveBeenCalledTimes(4)
    })
  })

  // ══════════════════════════════════════════════════════════════════════
  // create
  // ══════════════════════════════════════════════════════════════════════
  describe('create', () => {
    it('crée une organisation avec un inviteCode généré', async () => {
      const result = await service.create('Acme Corp', 'Entreprise', UID)

      expect(result.inviteCode).toBe('ABCD-1234')
      expect(orgModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name:       'Acme Corp',
          type:       'Entreprise',
          ownerId:    UID,
          inviteCode: expect.stringMatching(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/),
        }),
      )
    })

    it('appelle generateUniqueInviteCode avant la création', async () => {
      const spy = jest.spyOn(service, 'generateUniqueInviteCode')

      await service.create('Acme Corp', 'Entreprise', UID)

      expect(spy).toHaveBeenCalledTimes(1)
    })
  })

  // ══════════════════════════════════════════════════════════════════════
  // findByInviteCode
  // ══════════════════════════════════════════════════════════════════════
  describe('findByInviteCode', () => {
    it('retourne l\'organisation correspondant au code', async () => {
      orgModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(MOCK_ORG) })

      const result = await service.findByInviteCode('ABCD-1234')

      expect(result).toEqual(MOCK_ORG)
      expect(orgModel.findOne).toHaveBeenCalledWith({ inviteCode: 'ABCD-1234' })
    })

    it('retourne null si le code est invalide ou inexistant', async () => {
      orgModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) })

      const result = await service.findByInviteCode('ZZZZ-9999')

      expect(result).toBeNull()
    })

    it('transmet le code exact à la query (pas de transformation)', async () => {
      orgModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) })

      await service.findByInviteCode('abcd-1234')

      expect(orgModel.findOne).toHaveBeenCalledWith({ inviteCode: 'abcd-1234' })
    })
  })

  // ══════════════════════════════════════════════════════════════════════
  // regenerateInviteCode
  // ══════════════════════════════════════════════════════════════════════
  describe('regenerateInviteCode', () => {
    it('met à jour l\'inviteCode en base et retourne l\'org mise à jour', async () => {
      const updatedOrg = { ...MOCK_ORG, inviteCode: 'NEWW-CODE' }
      orgModel.findByIdAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(updatedOrg) })

      const result = await service.regenerateInviteCode(OID.toString())

      expect(result.inviteCode).not.toBe(MOCK_ORG.inviteCode)
      expect(orgModel.findByIdAndUpdate).toHaveBeenCalledWith(
        OID.toString(),
        expect.objectContaining({ inviteCode: expect.stringMatching(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/) }),
        { new: true },
      )
    })

    it('lève une erreur si l\'organisation n\'existe pas', async () => {
      orgModel.findByIdAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) })

      await expect(service.regenerateInviteCode('non-existent-id')).rejects.toThrow()
    })
  })
})
