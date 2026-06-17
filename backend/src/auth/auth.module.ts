import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { OrganizationsModule } from '../organizations/organizations.module'
import { User, UserSchema } from '../users/schemas/user.schema'
import { Organization, OrganizationSchema } from '../organizations/schemas/organization.schema'

@Module({
  imports: [
    PassportModule,
    // Secrets passés dynamiquement via signAsync — pas de secret global ici
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Organization.name, schema: OrganizationSchema },
    ]),
    OrganizationsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
