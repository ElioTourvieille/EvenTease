import { AuthService } from './auth.service';
import { RegisterOwnerDto } from './dto/register-owner.dto';
import { RegisterMemberDto } from './dto/register-member.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import type { JwtUser } from './strategies/jwt.strategy';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    registerOwner(dto: RegisterOwnerDto): Promise<import("./auth.service").AuthResponse>;
    registerMember(dto: RegisterMemberDto): Promise<import("./auth.service").AuthResponse>;
    login(dto: LoginDto): Promise<import("./auth.service").AuthResponse>;
    refresh(dto: RefreshTokenDto): Promise<{
        access_token: string;
    }>;
    logout(user: JwtUser): Promise<{
        message: string;
    }>;
    me(user: JwtUser): JwtUser;
}
