import { Controller, Get, Param, Patch } from '@nestjs/common'
import { OrganizationsService } from './organizations.service'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { Roles } from '../common/decorators/roles.decorator'
import { UserRole } from '../common/types/roles.enum'
import type { JwtUser } from '../auth/strategies/jwt.strategy'

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  // Route statique avant /:id
  @Get('me')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER)
  findMine(@CurrentUser() user: JwtUser) {
    return this.organizationsService.findById(user.organizationId)
  }

  @Patch('invite-code')
  @Roles(UserRole.OWNER)
  regenerateInviteCode(@CurrentUser() user: JwtUser) {
    return this.organizationsService.regenerateInviteCode(user.organizationId)
  }

  @Get(':id')
  @Roles(UserRole.OWNER)
  findOne(@Param('id') id: string) {
    return this.organizationsService.findById(id)
  }
}
