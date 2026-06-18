import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Organization, OrganizationDocument, OrgType } from './schemas/organization.schema'

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization.name)
    private readonly organizationModel: Model<OrganizationDocument>,
  ) {}

  private generateCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const segment = () =>
      Array.from({ length: 4 }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length))
      ).join('')
    return `${segment()}-${segment()}`
  }

  async generateUniqueInviteCode(): Promise<string> {
    let code = this.generateCode()
    while (await this.organizationModel.exists({ inviteCode: code })) {
      code = this.generateCode()
    }
    return code
  }

  async create(
    name: string,
    type: OrgType,
    ownerId: Types.ObjectId,
  ): Promise<OrganizationDocument> {
    const inviteCode = await this.generateUniqueInviteCode()
    return this.organizationModel.create({ name, type, ownerId, inviteCode })
  }

  async findByInviteCode(code: string): Promise<OrganizationDocument | null> {
    return this.organizationModel.findOne({ inviteCode: code }).exec()
  }

  async findById(id: string): Promise<OrganizationDocument | null> {
    return this.organizationModel.findById(id).exec()
  }

  async regenerateInviteCode(orgId: string): Promise<OrganizationDocument> {
    const newCode = await this.generateUniqueInviteCode()
    const updated = await this.organizationModel
      .findByIdAndUpdate(orgId, { inviteCode: newCode }, { new: true })
      .exec()
    if (!updated) throw new Error('Organisation introuvable')
    return updated
  }
}
