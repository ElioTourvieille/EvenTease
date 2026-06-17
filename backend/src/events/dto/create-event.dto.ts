import { IsEnum, IsString, MinLength } from 'class-validator'
import type { EventType, EventAccess } from '../schemas/event.schema'

export class CreateEventDto {
  @IsString()
  @MinLength(2)
  title!: string

  @IsEnum(['Team Building', 'Conférence', 'Apéritif', 'Autres'])
  type!: EventType

  @IsEnum(['Ouvert à tous', 'Equipe de direction', 'Service concerné'])
  invitation!: EventAccess

  @IsString()
  date!: string

  @IsString()
  time!: string

  @IsString()
  address!: string

  @IsString()
  description!: string
}
