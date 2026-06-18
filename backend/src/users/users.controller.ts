import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { Roles } from '../common/decorators/roles.decorator'
import { UserRole } from '../common/types/roles.enum'
import type { JwtUser } from '../auth/strategies/jwt.strategy'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Routes statiques en premier pour éviter le conflit avec /:id
  @Get('me')
  getMe(@CurrentUser() user: JwtUser) {
    return this.usersService.findMe(user._id)
  }

  @Put('me')
  updateMe(@Body() dto: UpdateProfileDto, @CurrentUser() user: JwtUser) {
    return this.usersService.updateProfile(user._id, dto)
  }

  @Get()
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  findAll(@CurrentUser() user: JwtUser) {
    return this.usersService.findAllInOrg(user.organizationId)
  }

  @Put(':id/role')
  @Roles(UserRole.OWNER)
  updateRole(
    @Param('id') id: string,
    @Body() dto: UpdateRoleDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.usersService.updateRole(id, dto.role, user.organizationId)
  }

  @Delete(':id')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    await this.usersService.removeFromOrg(id, user.organizationId, user._id)
  }
}
