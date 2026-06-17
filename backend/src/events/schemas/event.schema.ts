import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type EventDocument = HydratedDocument<Event>

export type EventStatus = 'pending' | 'published' | 'cancelled'
export type EventType = 'Team Building' | 'Conférence' | 'Apéritif' | 'Autres'
export type EventAccess = 'Ouvert à tous' | 'Equipe de direction' | 'Service concerné'

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Event {
  @Prop({ required: true, trim: true })
  title!: string

  @Prop({ required: true, enum: ['Team Building', 'Conférence', 'Apéritif', 'Autres'] })
  type!: EventType

  @Prop({ required: true, enum: ['Ouvert à tous', 'Equipe de direction', 'Service concerné'] })
  invitation!: EventAccess

  @Prop({ required: true })
  date!: string

  @Prop({ required: true })
  time!: string

  @Prop({ required: true })
  address!: string

  @Prop({ required: true })
  description!: string

  @Prop()
  image?: string

  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  organizationId!: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy!: Types.ObjectId

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  participants!: Types.ObjectId[]

  @Prop({ required: true, enum: ['pending', 'published', 'cancelled'], default: 'pending' })
  status!: EventStatus

  @Prop()
  cancelReason?: string
}

export const EventSchema = SchemaFactory.createForClass(Event)
