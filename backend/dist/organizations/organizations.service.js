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
exports.OrganizationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const organization_schema_1 = require("./schemas/organization.schema");
let OrganizationsService = class OrganizationsService {
    constructor(organizationModel) {
        this.organizationModel = organizationModel;
    }
    generateCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const segment = () => Array.from({ length: 4 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
        return `${segment()}-${segment()}`;
    }
    async generateUniqueInviteCode() {
        let code = this.generateCode();
        while (await this.organizationModel.exists({ inviteCode: code })) {
            code = this.generateCode();
        }
        return code;
    }
    async create(name, type, ownerId) {
        const inviteCode = await this.generateUniqueInviteCode();
        return this.organizationModel.create({ name, type, ownerId, inviteCode });
    }
    async findByInviteCode(code) {
        return this.organizationModel.findOne({ inviteCode: code }).exec();
    }
    async findById(id) {
        return this.organizationModel.findById(id).exec();
    }
};
exports.OrganizationsService = OrganizationsService;
exports.OrganizationsService = OrganizationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(organization_schema_1.Organization.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], OrganizationsService);
//# sourceMappingURL=organizations.service.js.map