import type { OrgType } from '../../organizations/schemas/organization.schema';
export declare class RegisterOwnerDto {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    orgName: string;
    orgType: OrgType;
}
