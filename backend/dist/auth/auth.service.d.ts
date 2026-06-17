import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Connection, Model } from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema';
import { OrganizationDocument } from '../organizations/schemas/organization.schema';
import { OrganizationsService } from '../organizations/organizations.service';
import { RegisterOwnerDto } from './dto/register-owner.dto';
import { RegisterMemberDto } from './dto/register-member.dto';
import { LoginDto } from './dto/login.dto';
export interface AuthTokens {
    access_token: string;
    refresh_token: string;
}
export interface AuthResponse extends AuthTokens {
    user: {
        _id: string;
        first_name: string;
        last_name: string;
        email: string;
        role: string;
        organizationId: string;
    };
}
export declare class AuthService {
    private readonly userModel;
    private readonly organizationModel;
    private readonly connection;
    private readonly organizationsService;
    private readonly jwtService;
    private readonly configService;
    constructor(userModel: Model<UserDocument>, organizationModel: Model<OrganizationDocument>, connection: Connection, organizationsService: OrganizationsService, jwtService: JwtService, configService: ConfigService);
    private hashData;
    private generateTokens;
    private storeRefreshToken;
    private buildResponse;
    registerOwner(dto: RegisterOwnerDto): Promise<AuthResponse>;
    registerMember(dto: RegisterMemberDto): Promise<AuthResponse>;
    login(dto: LoginDto): Promise<AuthResponse>;
    refreshToken(token: string): Promise<{
        access_token: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
}
