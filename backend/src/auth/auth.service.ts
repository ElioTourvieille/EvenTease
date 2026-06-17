import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Connection, Model, Types } from 'mongoose'
import * as bcrypt from 'bcryptjs'
import { User, UserDocument } from '../users/schemas/user.schema'
import { Organization, OrganizationDocument } from '../organizations/schemas/organization.schema'
import { OrganizationsService } from '../organizations/organizations.service'
import { RegisterOwnerDto } from './dto/register-owner.dto'
import { RegisterMemberDto } from './dto/register-member.dto'
import { LoginDto } from './dto/login.dto'
import type { JwtPayload } from './strategies/jwt.strategy'

const SALT_ROUNDS = 10

interface AuthTokens {
  access_token: string
  refresh_token: string
}

interface AuthResponse extends AuthTokens {
  user: {
    _id: string
    first_name: string
    last_name: string
    email: string
    role: string
    organizationId: string
  }
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Organization.name)
    private readonly organizationModel: Model<OrganizationDocument>,
    @InjectConnection()
    private readonly connection: Connection,
    private readonly organizationsService: OrganizationsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async hashData(data: string): Promise<string> {
    return bcrypt.hash(data, SALT_ROUNDS)
  }

  private async generateTokens(payload: JwtPayload): Promise<AuthTokens> {
    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      expiresIn: this.configService.getOrThrow<string>('JWT_EXPIRES_IN'),
    })
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRES_IN'),
    })
    return { access_token, refresh_token }
  }

  private async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hashed = await bcrypt.hash(refreshToken, SALT_ROUNDS)
    await this.userModel.findByIdAndUpdate(userId, { refreshToken: hashed })
  }

  private buildResponse(user: UserDocument, tokens: AuthTokens): AuthResponse {
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
    }
  }

  async registerOwner(dto: RegisterOwnerDto): Promise<AuthResponse> {
    if (await this.userModel.exists({ email: dto.email })) {
      throw new ConflictException('Email déjà utilisé')
    }

    // Généré avant la transaction (lecture seule, l'index unique protège contre les doublons)
    const inviteCode = await this.organizationsService.generateUniqueInviteCode()
    const hashedPassword = await this.hashData(dto.password)
    const userId = new Types.ObjectId()
    const session = await this.connection.startSession()

    try {
      session.startTransaction()

      const orgDocs = await this.organizationModel.create(
        [{ name: dto.orgName, type: dto.orgType, ownerId: userId, inviteCode }],
        { session },
      )
      const org = orgDocs[0]
      if (!org) throw new InternalServerErrorException()

      const userDocs = await this.userModel.create(
        [{
          _id: userId,
          first_name: dto.first_name,
          last_name: dto.last_name,
          email: dto.email,
          password: hashedPassword,
          organizationId: org._id,
          role: 'owner',
        }],
        { session },
      )
      const user = userDocs[0]
      if (!user) throw new InternalServerErrorException()

      await session.commitTransaction()

      const payload: JwtPayload = {
        sub: user._id.toString(),
        email: user.email,
        role: user.role,
        organizationId: org._id.toString(),
      }
      const tokens = await this.generateTokens(payload)
      await this.storeRefreshToken(user._id.toString(), tokens.refresh_token)

      return this.buildResponse(user, tokens)
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      await session.endSession()
    }
  }

  async registerMember(dto: RegisterMemberDto): Promise<AuthResponse> {
    const org = await this.organizationsService.findByInviteCode(dto.inviteCode)
    if (!org) throw new NotFoundException("Code d'invitation invalide")

    if (await this.userModel.exists({ email: dto.email })) {
      throw new ConflictException('Email déjà utilisé')
    }

    const hashedPassword = await this.hashData(dto.password)
    const user = await this.userModel.create({
      first_name: dto.first_name,
      last_name: dto.last_name,
      email: dto.email,
      password: hashedPassword,
      organizationId: org._id,
      role: 'member',
    })

    const payload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      organizationId: org._id.toString(),
    }
    const tokens = await this.generateTokens(payload)
    await this.storeRefreshToken(user._id.toString(), tokens.refresh_token)

    return this.buildResponse(user, tokens)
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.userModel.findOne({ email: dto.email }).exec()
    if (!user) throw new UnauthorizedException('Identifiants invalides')

    const passwordMatches = await bcrypt.compare(dto.password, user.password)
    if (!passwordMatches) throw new UnauthorizedException('Identifiants invalides')

    const payload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      organizationId: user.organizationId.toString(),
    }
    const tokens = await this.generateTokens(payload)
    await this.storeRefreshToken(user._id.toString(), tokens.refresh_token)

    return this.buildResponse(user, tokens)
  }

  async refreshToken(token: string): Promise<{ access_token: string }> {
    let payload: JwtPayload
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      })
    } catch {
      throw new UnauthorizedException('Refresh token invalide')
    }

    const user = await this.userModel.findById(payload.sub).exec()
    if (!user?.refreshToken) throw new UnauthorizedException('Session expirée')

    const tokenMatches = await bcrypt.compare(token, user.refreshToken)
    if (!tokenMatches) throw new UnauthorizedException('Refresh token invalide')

    const newPayload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      organizationId: user.organizationId.toString(),
    }

    const access_token = await this.jwtService.signAsync(newPayload, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      expiresIn: this.configService.getOrThrow<string>('JWT_EXPIRES_IN'),
    })

    return { access_token }
  }

  async logout(userId: string): Promise<{ message: string }> {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken: null })
    return { message: 'Déconnecté avec succès' }
  }
}
