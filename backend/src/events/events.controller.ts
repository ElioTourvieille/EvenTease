import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common'
import { EventsService } from './events.service'
import { CreateEventDto } from './dto/create-event.dto'
import { UpdateEventDto } from './dto/update-event.dto'
import { CancelEventDto } from './dto/cancel-event.dto'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { Roles } from '../common/decorators/roles.decorator'
import { UserRole } from '../common/types/roles.enum'
import type { JwtUser } from '../auth/strategies/jwt.strategy'

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // Routes statiques en premier pour éviter les conflits avec /:id
  @Get('pending')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  findPending(@CurrentUser() user: JwtUser) {
    return this.eventsService.findPending(user.organizationId)
  }

  @Get('stats')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  getStats(@CurrentUser() user: JwtUser) {
    return this.eventsService.getStats(user.organizationId)
  }

  @Get('mine')
  findMine(@CurrentUser() user: JwtUser) {
    return this.eventsService.findMine(user._id, user.organizationId)
  }

  @Get('archived')
  findArchived(@CurrentUser() user: JwtUser) {
    return this.eventsService.findAllArchived(user.organizationId)
  }

  @Get()
  findAll(@CurrentUser() user: JwtUser) {
    return this.eventsService.findAllUpcoming(user.organizationId)
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    return this.eventsService.findById(id, user.organizationId)
  }

  @Post()
  create(@Body() dto: CreateEventDto, @CurrentUser() user: JwtUser) {
    return this.eventsService.create(dto, user._id, user.organizationId, user.role)
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.eventsService.update(id, dto, user._id, user.role, user.organizationId)
  }

  @Patch(':id/validate')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  validate(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    return this.eventsService.validate(id, user.organizationId)
  }

  @Patch(':id/cancel')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  cancel(@Param('id') id: string, @Body() dto: CancelEventDto, @CurrentUser() user: JwtUser) {
    return this.eventsService.cancel(id, dto.reason, user.organizationId)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    await this.eventsService.delete(id, user._id, user.role, user.organizationId)
  }

  @Put(':id/participate')
  participate(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    return this.eventsService.participate(id, user._id, user.organizationId)
  }

  @Delete(':id/unsubscribe')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unsubscribe(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    await this.eventsService.unsubscribe(id, user._id, user.organizationId)
  }
}
