import { Body, Controller, Get, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterOwnerDto } from './dto/register-owner.dto'
import { RegisterMemberDto } from './dto/register-member.dto'
import { LoginDto } from './dto/login.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { Public } from '../common/decorators/public.decorator'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import type { JwtUser } from './strategies/jwt.strategy'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register/owner')
  registerOwner(@Body() dto: RegisterOwnerDto) {
    return this.authService.registerOwner(dto)
  }

  @Public()
  @Post('register/member')
  registerMember(@Body() dto: RegisterMemberDto) {
    return this.authService.registerMember(dto)
  }

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }

  @Public()
  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refresh_token)
  }

  @Post('logout')
  logout(@CurrentUser() user: JwtUser) {
    return this.authService.logout(user._id)
  }

  @Get('me')
  me(@CurrentUser() user: JwtUser) {
    return user
  }
}
