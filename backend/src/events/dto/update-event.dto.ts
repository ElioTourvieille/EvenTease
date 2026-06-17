import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator'
import type { EventType, EventAccess } from '../schemas/event.schema'

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  title?: string

  @IsOptional()
  @IsEnum(['Team Building', 'Conférence', 'Apéritif', 'Autres'])
  type?: EventType

  @IsOptional()
  @IsEnum(['Ouvert à tous', 'Equipe de direction', 'Service concerné'])
  invitation?: EventAccess

  @IsOptional()
  @IsString()
  date?: string

  @IsOptional()
  @IsString()
  time?: string

  @IsOptional()
  @IsString()
  address?: string

  @IsOptional()
  @IsString()
  description?: string
}
