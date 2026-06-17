import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Event, EventDocument } from './schemas/event.schema'
import { User, UserDocument } from '../users/schemas/user.schema'
import { CreateEventDto } from './dto/create-event.dto'
import { UpdateEventDto } from './dto/update-event.dto'

interface EventStats {
  eventCount: number
  userCount: number
  pendingCount: number
}

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name)
    private readonly eventModel: Model<EventDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  // Vérifie l'appartenance à l'org — utilisé comme garde interne avant toute mutation
  private async findByIdInOrg(id: string, orgId: string): Promise<EventDocument> {
    const event = await this.eventModel.findById(id).exec()
    if (!event) throw new NotFoundException('Événement introuvable')
    if (event.organizationId.toString() !== orgId) throw new ForbiddenException()
    return event
  }

  async create(
    dto: CreateEventDto,
    userId: string,
    orgId: string,
    role: string,
  ): Promise<EventDocument> {
    const status = role === 'member' ? 'pending' : 'published'
    return this.eventModel.create({
      ...dto,
      organizationId: new Types.ObjectId(orgId),
      createdBy: new Types.ObjectId(userId),
      status,
    })
  }

  async findAllPublished(orgId: string): Promise<EventDocument[]> {
    return this.eventModel
      .find({ organizationId: orgId, status: 'published' })
      .sort({ date: 1 })
      .exec()
  }

  async findPending(orgId: string): Promise<EventDocument[]> {
    return this.eventModel
      .find({ organizationId: orgId, status: 'pending' })
      .sort({ createdAt: -1 })
      .exec()
  }

  async findById(id: string, orgId: string): Promise<EventDocument> {
    return this.findByIdInOrg(id, orgId)
  }

  async update(
    id: string,
    dto: UpdateEventDto,
    userId: string,
    role: string,
    orgId: string,
  ): Promise<EventDocument> {
    const event = await this.findByIdInOrg(id, orgId)

    if (role === 'member' && event.createdBy.toString() !== userId) {
      throw new ForbiddenException('Vous ne pouvez modifier que vos propres événements')
    }

    const updated = await this.eventModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .exec()
    if (!updated) throw new NotFoundException()
    return updated
  }

  async validate(id: string, orgId: string): Promise<EventDocument> {
    await this.findByIdInOrg(id, orgId)
    const updated = await this.eventModel
      .findByIdAndUpdate(id, { status: 'published' }, { new: true })
      .exec()
    if (!updated) throw new NotFoundException()
    return updated
  }

  async cancel(id: string, reason: string, orgId: string): Promise<EventDocument> {
    await this.findByIdInOrg(id, orgId)
    const updated = await this.eventModel
      .findByIdAndUpdate(id, { status: 'cancelled', cancelReason: reason }, { new: true })
      .exec()
    if (!updated) throw new NotFoundException()
    return updated
  }

  async delete(id: string, userId: string, role: string, orgId: string): Promise<void> {
    const event = await this.findByIdInOrg(id, orgId)

    if (role === 'member' && event.createdBy.toString() !== userId) {
      throw new ForbiddenException('Vous ne pouvez supprimer que vos propres événements')
    }

    await this.eventModel.findByIdAndDelete(id)
  }

  async participate(id: string, userId: string, orgId: string): Promise<EventDocument> {
    const event = await this.findByIdInOrg(id, orgId)

    if (event.status !== 'published') {
      throw new BadRequestException('Impossible de s\'inscrire à un événement non publié')
    }

    const updated = await this.eventModel
      .findByIdAndUpdate(
        id,
        { $addToSet: { participants: new Types.ObjectId(userId) } },
        { new: true },
      )
      .exec()
    if (!updated) throw new NotFoundException()
    return updated
  }

  async unsubscribe(id: string, userId: string, orgId: string): Promise<EventDocument> {
    await this.findByIdInOrg(id, orgId)
    const updated = await this.eventModel
      .findByIdAndUpdate(
        id,
        { $pull: { participants: new Types.ObjectId(userId) } },
        { new: true },
      )
      .exec()
    if (!updated) throw new NotFoundException()
    return updated
  }

  async getStats(orgId: string): Promise<EventStats> {
    const results = await Promise.all([
      this.eventModel.countDocuments({ organizationId: orgId, status: 'published' }),
      this.userModel.countDocuments({ organizationId: orgId }),
      this.eventModel.countDocuments({ organizationId: orgId, status: 'pending' }),
    ])
    return {
      eventCount: results[0] ?? 0,
      userCount: results[1] ?? 0,
      pendingCount: results[2] ?? 0,
    }
  }
}
