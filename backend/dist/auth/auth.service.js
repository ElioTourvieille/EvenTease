"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcryptjs");
const user_schema_1 = require("../users/schemas/user.schema");
const organization_schema_1 = require("../organizations/schemas/organization.schema");
const organizations_service_1 = require("../organizations/organizations.service");
const SALT_ROUNDS = 10;
let AuthService = class AuthService {
    constructor(userModel, organizationModel, connection, organizationsService, jwtService, configService) {
        this.userModel = userModel;
        this.organizationModel = organizationModel;
        this.connection = connection;
        this.organizationsService = organizationsService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async hashData(data) {
        return bcrypt.hash(data, SALT_ROUNDS);
    }
    async generateTokens(payload) {
        const access_token = await this.jwtService.signAsync(payload, {
            secret: this.configService.getOrThrow('JWT_SECRET'),
            expiresIn: this.configService.getOrThrow('JWT_EXPIRES_IN'),
        });
        const refresh_token = await this.jwtService.signAsync(payload, {
            secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.getOrThrow('JWT_REFRESH_EXPIRES_IN'),
        });
        return { access_token, refresh_token };
    }
    async storeRefreshToken(userId, refreshToken) {
        const hashed = await bcrypt.hash(refreshToken, SALT_ROUNDS);
        await this.userModel.findByIdAndUpdate(userId, { refreshToken: hashed });
    }
    buildResponse(user, tokens) {
        return {
            ...tokens,
            user: {
                _id: user._id.toString(),
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
                organizationId: user.organizationId.toString(),
            },
        };
    }
    async registerOwner(dto) {
        if (await this.userModel.exists({ email: dto.email })) {
            throw new common_1.ConflictException('Email déjà utilisé');
        }
        const inviteCode = await this.organizationsService.generateUniqueInviteCode();
        const hashedPassword = await this.hashData(dto.password);
        const userId = new mongoose_2.Types.ObjectId();
        const session = await this.connection.startSession();
        try {
            session.startTransaction();
            const orgDocs = await this.organizationModel.create([{ name: dto.orgName, type: dto.orgType, ownerId: userId, inviteCode }], { session });
            const org = orgDocs[0];
            if (!org)
                throw new common_1.InternalServerErrorException();
            const userDocs = await this.userModel.create([{
                    _id: userId,
                    first_name: dto.first_name,
                    last_name: dto.last_name,
                    email: dto.email,
                    password: hashedPassword,
                    organizationId: org._id,
                    role: 'owner',
                }], { session });
            const user = userDocs[0];
            if (!user)
                throw new common_1.InternalServerErrorException();
            await session.commitTransaction();
            const payload = {
                sub: user._id.toString(),
                email: user.email,
                role: user.role,
                organizationId: org._id.toString(),
            };
            const tokens = await this.generateTokens(payload);
            await this.storeRefreshToken(user._id.toString(), tokens.refresh_token);
            return this.buildResponse(user, tokens);
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            await session.endSession();
        }
    }
    async registerMember(dto) {
        const org = await this.organizationsService.findByInviteCode(dto.inviteCode);
        if (!org)
            throw new common_1.NotFoundException("Code d'invitation invalide");
        if (await this.userModel.exists({ email: dto.email })) {
            throw new common_1.ConflictException('Email déjà utilisé');
        }
        const hashedPassword = await this.hashData(dto.password);
        const user = await this.userModel.create({
            first_name: dto.first_name,
            last_name: dto.last_name,
            email: dto.email,
            password: hashedPassword,
            organizationId: org._id,
            role: 'member',
        });
        const payload = {
            sub: user._id.toString(),
            email: user.email,
            role: user.role,
            organizationId: org._id.toString(),
        };
        const tokens = await this.generateTokens(payload);
        await this.storeRefreshToken(user._id.toString(), tokens.refresh_token);
        return this.buildResponse(user, tokens);
    }
    async login(dto) {
        const user = await this.userModel.findOne({ email: dto.email }).exec();
        if (!user)
            throw new common_1.UnauthorizedException('Identifiants invalides');
        const passwordMatches = await bcrypt.compare(dto.password, user.password);
        if (!passwordMatches)
            throw new common_1.UnauthorizedException('Identifiants invalides');
        const payload = {
            sub: user._id.toString(),
            email: user.email,
            role: user.role,
            organizationId: user.organizationId.toString(),
        };
        const tokens = await this.generateTokens(payload);
        await this.storeRefreshToken(user._id.toString(), tokens.refresh_token);
        return this.buildResponse(user, tokens);
    }
    async refreshToken(token) {
        let payload;
        try {
            payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
            });
        }
        catch {
            throw new common_1.UnauthorizedException('Refresh token invalide');
        }
        const user = await this.userModel.findById(payload.sub).exec();
        if (!user?.refreshToken)
            throw new common_1.UnauthorizedException('Session expirée');
        const tokenMatches = await bcrypt.compare(token, user.refreshToken);
        if (!tokenMatches)
            throw new common_1.UnauthorizedException('Refresh token invalide');
        const newPayload = {
            sub: user._id.toString(),
            email: user.email,
            role: user.role,
            organizationId: user.organizationId.toString(),
        };
        const access_token = await this.jwtService.signAsync(newPayload, {
            secret: this.configService.getOrThrow('JWT_SECRET'),
            expiresIn: this.configService.getOrThrow('JWT_EXPIRES_IN'),
        });
        return { access_token };
    }
    async logout(userId) {
        await this.userModel.findByIdAndUpdate(userId, { refreshToken: null });
        return { message: 'Déconnecté avec succès' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(organization_schema_1.Organization.name)),
    __param(2, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Connection,
        organizations_service_1.OrganizationsService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map