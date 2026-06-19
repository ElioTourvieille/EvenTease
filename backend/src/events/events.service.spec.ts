import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common'
import { Types } from 'mongoose'

import { EventsService } from './events.service'
import { Event } from './schemas/event.schema'
import { User } from '../users/schemas/user.schema'

/* ── Fixtures ──────────────────────────────────────────────────────────── */
const ORG_A   = new Types.ObjectId()
const ORG_B   = new Types.ObjectId()
const USER_A  = new Types.ObjectId()
const EV_ID   = new Types.ObjectId()

const BASE_EVENT = {
  _id:            EV_ID,
  title:          'Team Lunch',
  type:           'Apéritif' as const,
  invitation:     'Ouvert à tous' as const,
  date:           '2026-09-15',
  time:           '12:30',
  address:        'Rue de Rive 1, Genève',
  description:    'Repas convivial',
  organizationId: ORG_A,
  createdBy:      USER_A,
  participants:   [] as Types.ObjectId[],
  status:         'published' as const,
}

const EVENT_PENDING   = { ...BASE_EVENT, _id: new Types.ObjectId(), status: 'pending'   as const }
const EVENT_CANCELLED = { ...BASE_EVENT, _id: new Types.ObjectId(), status: 'cancelled' as const }

/* ── Helpers ───────────────────────────────────────────────────────────── */
/**
 * Retourne un objet simulant le chaînage Mongoose :
 * model.find(...).sort(...).exec() ou model.findById(...).exec()
 */
const chainMock = (resolved: unknown) => ({
  sort: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(resolved) }),
  exec: jest.fn().mockResolvedValue(resolved),
  lean: jest.fn().mockResolvedValue(resolved),
})

const execMock = (resolved: unknown) => ({ exec: jest.fn().mockResolvedValue(resolved) })

/* ── Suite ─────────────────────────────────────────────────────────────── */
describe('EventsService', () => {
  let service: EventsService

  let eventModel: {
    create:            jest.Mock
    find:              jest.Mock
    findById:          jest.Mock
    findByIdAndUpdate: jest.Mock
    findByIdAndDelete: jest.Mock
    countDocuments:    jest.Mock
  }
  let userModel: {
    countDocuments: jest.Mock
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    eventModel = {
      create:            jest.fn(),
      find:              jest.fn(),
      findById:          jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn().mockResolvedValue(null),
      countDocuments:    jest.fn().mockResolvedValue(0),
    }

    userModel = {
      countDocuments: jest.fn().mockResolvedValue(3),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: getModelToken(Event.name), useValue: eventModel },
        { provide: getModelToken(User.name),  useValue: userModel  },
      ],
    }).compile()

    service = module.get<EventsService>(EventsService)
  })

  // ══════════════════════════════════════════════════════════════════════
  // create
  // ══════════════════════════════════════════════════════════════════════
  describe('create', () => {
    const dto = {
      title:       'Séminaire Q3',
      type:        'Conférence' as const,
      invitation:  'Ouvert à tous' as const,
      date:        '2026-10-10',
      time:        '09:00',
      address:     'Lausanne',
      description: 'Revue trimestrielle',
    }

    it('crée l\'event avec status pending si le role est member', async () => {
      eventModel.create.mockResolvedValue({ ...dto, status: 'pending' })

      const result = await service.create(dto, USER_A.toString(), ORG_A.toString(), 'member')

      expect(result.status).toBe('pending')
      expect(eventModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'pending' }),
      )
    })

    it('crée l\'event avec status published si le role est admin', async () => {
      eventModel.create.mockResolvedValue({ ...dto, status: 'published' })

      await service.create(dto, USER_A.toString(), ORG_A.toString(), 'admin')

      expect(eventModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'published' }),
      )
    })

    it('crée l\'event avec status published si le role est owner', async () => {
      eventModel.create.mockResolvedValue({ ...dto, status: 'published' })

      await service.create(dto, USER_A.toString(), ORG_A.toString(), 'owner')

      expect(eventModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'published' }),
      )
    })

    it('associe l\'event à l\'organisation et au créateur via ObjectId', async () => {
      eventModel.create.mockResolvedValue({ ...dto, status: 'published' })

      await service.create(dto, USER_A.toString(), ORG_A.toString(), 'admin')

      expect(eventModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          organizationId: expect.any(Types.ObjectId),
          createdBy:      expect.any(Types.ObjectId),
        }),
      )
    })
  })

  // ══════════════════════════════════════════════════════════════════════
  // validate
  // (Note : la restriction "member → 403" est appliquée par RolesGuard au
  //  niveau du contrôleur — @Roles(OWNER, ADMIN). On teste ici uniquement
  //  le contrat du service.)
  // ══════════════════════════════════════════════════════════════════════
  describe('validate', () => {
    it('met l\'event en published et retourne le document mis à jour', async () => {
      const published = { ...EVENT_PENDING, status: 'published' as const }

      eventModel.findById.mockReturnValue(execMock(EVENT_PENDING))
      eventModel.findByIdAndUpdate.mockReturnValue(execMock(published))

      const result = await service.validate(EVENT_PENDING._id.toString(), ORG_A.toString())

      expect(result.status).toBe('published')
      expect(eventModel.findByIdAndUpdate).toHaveBeenCalledWith(
        EVENT_PENDING._id.toString(),
        { status: 'published' },
        { new: true },
      )
    })

    it('lève NotFoundException si l\'event n\'existe pas', async () => {
      eventModel.findById.mockReturnValue(execMock(null))

      await expect(
        service.validate(EV_ID.toString(), ORG_A.toString()),
      ).rejects.toThrow(NotFoundException)
    })

    it('lève ForbiddenException si l\'event appartient à une autre organisation', async () => {
      const alienEvent = { ...EVENT_PENDING, organizationId: ORG_B }
      eventModel.findById.mockReturnValue(execMock(alienEvent))

      await expect(
        service.validate(EV_ID.toString(), ORG_A.toString()),
      ).rejects.toThrow(ForbiddenException)
    })
  })

  // ══════════════════════════════════════════════════════════════════════
  // cancel
  // ══════════════════════════════════════════════════════════════════════
  describe('cancel', () => {
    beforeEach(() => {
      eventModel.findById.mockReturnValue(execMock(BASE_EVENT))
    })

    it('met l\'event en cancelled avec la raison fournie', async () => {
      const reason    = 'Salle indisponible en raison de travaux'
      const cancelled = { ...BASE_EVENT, status: 'cancelled' as const, cancelReason: reason }

      eventModel.findByIdAndUpdate.mockReturnValue(execMock(cancelled))

      const result = await service.cancel(EV_ID.toString(), reason, ORG_A.toString())

      expect(result.status).toBe('cancelled')
      expect(eventModel.findByIdAndUpdate).toHaveBeenCalledWith(
        EV_ID.toString(),
        { status: 'cancelled', cancelReason: reason },
        { new: true },
      )
    })

    it('persiste cancelReason dans la mise à jour', async () => {
      const reason    = 'Budget insuffisant'
      const cancelled = { ...BASE_EVENT, status: 'cancelled' as const, cancelReason: reason }

      eventModel.findByIdAndUpdate.mockReturnValue(execMock(cancelled))

      await service.cancel(EV_ID.toString(), reason, ORG_A.toString())

      expect(eventModel.findByIdAndUpdate).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ cancelReason: reason }),
        expect.anything(),
      )
    })

    it('lève ForbiddenException si l\'event appartient à une autre org', async () => {
      const alienEvent = { ...BASE_EVENT, organizationId: ORG_B }
      eventModel.findById.mockReturnValue(execMock(alienEvent))

      await expect(
        service.cancel(EV_ID.toString(), 'raison', ORG_A.toString()),
      ).rejects.toThrow(ForbiddenException)
    })
  })

  // ══════════════════════════════════════════════════════════════════════
  // participate
  // ══════════════════════════════════════════════════════════════════════
  describe('participate', () => {
    it('ajoute l\'utilisateur aux participants via $addToSet', async () => {
      const withParticipant = { ...BASE_EVENT, participants: [USER_A] }

      eventModel.findById.mockReturnValue(execMock(BASE_EVENT))
      eventModel.findByIdAndUpdate.mockReturnValue(execMock(withParticipant))

      const result = await service.participate(EV_ID.toString(), USER_A.toString(), ORG_A.toString())

      expect(eventModel.findByIdAndUpdate).toHaveBeenCalledWith(
        EV_ID.toString(),
        { $addToSet: { participants: expect.any(Types.ObjectId) } },
        { new: true },
      )
      expect(result.participants).toHaveLength(1)
    })

    it('est idempotent si l\'utilisateur est déjà inscrit ($addToSet ne duplique pas)', async () => {
      const alreadyIn = { ...BASE_EVENT, participants: [USER_A] }

      eventModel.findById.mockReturnValue(execMock(alreadyIn))
      eventModel.findByIdAndUpdate.mockReturnValue(execMock(alreadyIn))

      await expect(
        service.participate(EV_ID.toString(), USER_A.toString(), ORG_A.toString()),
      ).resolves.not.toThrow()
    })

    it('lève BadRequestException si l\'event est cancelled', async () => {
      eventModel.findById.mockReturnValue(execMock(EVENT_CANCELLED))

      await expect(
        service.participate(EV_ID.toString(), USER_A.toString(), ORG_A.toString()),
      ).rejects.toThrow(BadRequestException)
    })

    it('lève BadRequestException si l\'event est pending', async () => {
      eventModel.findById.mockReturnValue(execMock(EVENT_PENDING))

      await expect(
        service.participate(EV_ID.toString(), USER_A.toString(), ORG_A.toString()),
      ).rejects.toThrow(BadRequestException)
    })

    it('lève ForbiddenException si l\'event appartient à une autre org', async () => {
      const alienEvent = { ...BASE_EVENT, organizationId: ORG_B }
      eventModel.findById.mockReturnValue(execMock(alienEvent))

      await expect(
        service.participate(EV_ID.toString(), USER_A.toString(), ORG_A.toString()),
      ).rejects.toThrow(ForbiddenException)
    })
  })

  // ══════════════════════════════════════════════════════════════════════
  // findAllPublished — isolation par organisation
  // ══════════════════════════════════════════════════════════════════════
  describe('findAllPublished', () => {
    const ORG_A_EVENTS = [
      BASE_EVENT,
      { ...BASE_EVENT, _id: new Types.ObjectId(), title: 'BBQ Été' },
    ]

    it('filtre par organizationId et status published', async () => {
      eventModel.find.mockReturnValue(chainMock(ORG_A_EVENTS))

      await service.findAllPublished(ORG_A.toString())

      expect(eventModel.find).toHaveBeenCalledWith(
        expect.objectContaining({
          organizationId: expect.any(Types.ObjectId),
          status: 'published',
        }),
      )
    })

    it('retourne uniquement les events de l\'org demandée', async () => {
      eventModel.find.mockReturnValue(chainMock(ORG_A_EVENTS))

      const result = await service.findAllPublished(ORG_A.toString())

      expect(result).toHaveLength(2)
    })

    it('n\'expose pas les events d\'une autre organisation (isolation multi-tenant)', async () => {
      /* Org A a 2 events, Org B n'en a aucun côté mock */
      eventModel.find.mockImplementation(
        ({ organizationId }: { organizationId: Types.ObjectId }) => {
          const isOrgA = organizationId.toString() === ORG_A.toString()
          return chainMock(isOrgA ? ORG_A_EVENTS : [])
        },
      )

      const forOrgA = await service.findAllPublished(ORG_A.toString())
      const forOrgB = await service.findAllPublished(ORG_B.toString())

      expect(forOrgA).toHaveLength(2)
      expect(forOrgB).toHaveLength(0)
    })

    it('retourne un tableau vide si aucun event publié', async () => {
      eventModel.find.mockReturnValue(chainMock([]))

      const result = await service.findAllPublished(ORG_A.toString())

      expect(result).toEqual([])
    })

    it('utilise un vrai Types.ObjectId pour le filtre (pas une string brute)', async () => {
      eventModel.find.mockReturnValue(chainMock([]))

      await service.findAllPublished(ORG_A.toString())

      const [filterArg] = eventModel.find.mock.calls[0] as [{ organizationId: unknown }]
      expect(filterArg.organizationId).toBeInstanceOf(Types.ObjectId)
    })
  })

  // ══════════════════════════════════════════════════════════════════════
  // getStats
  // ══════════════════════════════════════════════════════════════════════
  describe('getStats', () => {
    it('retourne les 4 métriques attendues', async () => {
      eventModel.countDocuments
        .mockResolvedValueOnce(5)  // eventCount (published)
        .mockResolvedValueOnce(2)  // pendingCount
      userModel.countDocuments.mockResolvedValue(10)
      eventModel.find.mockReturnValue({ lean: jest.fn().mockResolvedValue([
        { participants: ['a', 'b'] },
        { participants: ['a'] },
      ]) })

      const result = await service.getStats(ORG_A.toString())

      expect(result).toMatchObject({
        eventCount:  5,
        userCount:   10,
        pendingCount: 2,
      })
      expect(typeof result.participationRate).toBe('number')
    })

    it('retourne participationRate à 0 si aucun event ni user', async () => {
      eventModel.countDocuments.mockResolvedValue(0)
      userModel.countDocuments.mockResolvedValue(0)
      eventModel.find.mockReturnValue({ lean: jest.fn().mockResolvedValue([]) })

      const result = await service.getStats(ORG_A.toString())

      expect(result.participationRate).toBe(0)
    })
  })
})
