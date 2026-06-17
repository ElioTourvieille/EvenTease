import { IsString, MinLength } from 'class-validator'

export class CancelEventDto {
  @IsString()
  @MinLength(5)
  reason!: string
}
