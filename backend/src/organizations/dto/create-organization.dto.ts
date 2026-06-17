import { IsEnum, IsString, MinLength } from 'class-validator'
import type { OrgType } from '../schemas/organization.schema'

export class CreateOrganizationDto {
  @IsString()
  @MinLength(2)
  name!: string

  @IsEnum(['Entreprise', 'Association', 'Autres'])
  type!: OrgType
}
