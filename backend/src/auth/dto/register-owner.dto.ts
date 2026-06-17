import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator'
import type { OrgType } from '../../organizations/schemas/organization.schema'

export class RegisterOwnerDto {
  @IsString()
  first_name!: string

  @IsString()
  last_name!: string

  @IsEmail()
  email!: string

  @IsString()
  @MinLength(8)
  password!: string

  @IsString()
  @MinLength(2)
  orgName!: string

  @IsEnum(['Entreprise', 'Association', 'Autres'])
  orgType!: OrgType
}
