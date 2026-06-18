import { IsIn } from 'class-validator'

export class UpdateRoleDto {
  @IsIn(['admin', 'member'])
  role!: 'admin' | 'member'
}
