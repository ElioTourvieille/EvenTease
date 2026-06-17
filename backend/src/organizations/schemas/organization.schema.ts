import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type OrganizationDocument = HydratedDocument<Organization>
export type OrgType = 'Entreprise' | 'Association' | 'Autres'

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Organization {
  @Prop({ required: true, trim: true })
  name!: string

  @Prop({ required: true, enum: ['Entreprise', 'Association', 'Autres'] })
  type!: OrgType

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId!: Types.ObjectId

  @Prop({ required: true, unique: true })
  inviteCode!: string
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization)
