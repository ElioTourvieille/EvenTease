import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import * as bcrypt from 'bcryptjs'
import { User, UserDocument } from './schemas/user.schema'
import { UpdateProfileDto } from './dto/update-profile.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async findAllInOrg(orgId: string): Promise<UserDocument[]> {
    return this.userModel
      .find({ organizationId: new Types.ObjectId(orgId) })
      .select('-password -refreshToken')
      .sort({ role: 1, last_name: 1 })
      .exec()
  }

  async findMe(userId: string): Promise<UserDocument> {
    const user = await this.userModel
      .findById(userId)
      .select('-password -refreshToken')
      .exec()
    if (!user) throw new NotFoundException('Utilisateur introuvable')
    return user
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<UserDocument> {
    const updates: Record<string, string> = {}

    if (dto.email) {
      const exists = await this.userModel.exists({ email: dto.email, _id: { $ne: userId } }).exec()
      if (exists) throw new ConflictException('Cet email est déjà utilisé')
      updates['email'] = dto.email
    }

    if (dto.password) {
      updates['password'] = await bcrypt.hash(dto.password, 10)
    }

    const updated = await this.userModel
      .findByIdAndUpdate(userId, { $set: updates }, { new: true })
      .select('-password -refreshToken')
      .exec()
    if (!updated) throw new NotFoundException('Utilisateur introuvable')
    return updated
  }

  async updateRole(id: string, role: 'admin' | 'member', orgId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec()
    if (!user) throw new NotFoundException('Utilisateur introuvable')
    if (user.organizationId.toString() !== orgId) throw new ForbiddenException()
    if (user.role === 'owner') {
      throw new ForbiddenException('Le rôle owner ne peut pas être modifié')
    }

    const updated = await this.userModel
      .findByIdAndUpdate(id, { role }, { new: true })
      .select('-password -refreshToken')
      .exec()
    if (!updated) throw new NotFoundException()
    return updated
  }

  async removeFromOrg(id: string, orgId: string, requesterId: string): Promise<void> {
    const user = await this.userModel.findById(id).exec()
    if (!user) throw new NotFoundException('Utilisateur introuvable')
    if (user.organizationId.toString() !== orgId) throw new ForbiddenException()
    if (user.role === 'owner') {
      throw new ForbiddenException("L'owner ne peut pas être retiré de l'organisation")
    }
    if (id === requesterId) {
      throw new ForbiddenException('Vous ne pouvez pas vous retirer vous-même')
    }
    await this.userModel.findByIdAndDelete(id)
  }
}
