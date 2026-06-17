import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { OrganizationsService } from './organizations.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { UserRole } from '../common/types/roles.enum'

@Controller('organizations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get(':id')
  @Roles(UserRole.OWNER)
  findOne(@Param('id') id: string) {
    return this.organizationsService.findById(id)
  }
}
