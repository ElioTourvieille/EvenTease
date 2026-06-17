import { OrganizationsService } from './organizations.service';
export declare class OrganizationsController {
    private readonly organizationsService;
    constructor(organizationsService: OrganizationsService);
    findOne(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/organization.schema").Organization, {}, {}> & import("./schemas/organization.schema").Organization & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
}
