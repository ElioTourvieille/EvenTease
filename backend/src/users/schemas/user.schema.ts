import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type UserDocument = HydratedDocument<User>

export type UserRole = 'owner' | 'admin' | 'member'

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class User {
  @Prop({ required: true, trim: true })
  first_name!: string

  @Prop({ required: true, trim: true })
  last_name!: string

  @Prop({ required: true, unique: true, lowercase: true })
  email!: string

  @Prop({ required: true })
  password!: string

  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  organizationId!: Types.ObjectId

  @Prop({ required: true, enum: ['owner', 'admin', 'member'], default: 'member' })
  role!: UserRole

  @Prop()
  refreshToken?: string
}

export const UserSchema = SchemaFactory.createForClass(User)
