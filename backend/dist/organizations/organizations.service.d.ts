import { Model, Types } from 'mongoose';
import { OrganizationDocument, OrgType } from './schemas/organization.schema';
export declare class OrganizationsService {
    private readonly organizationModel;
    constructor(organizationModel: Model<OrganizationDocument>);
    private generateCode;
    generateUniqueInviteCode(): Promise<string>;
    create(name: string, type: OrgType, ownerId: Types.ObjectId): Promise<OrganizationDocument>;
    findByInviteCode(code: string): Promise<OrganizationDocument | null>;
    findById(id: string): Promise<OrganizationDocument | null>;
}
