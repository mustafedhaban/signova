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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignaturesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SignaturesService = class SignaturesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createSignatureDto) {
        return this.prisma.signature.create({
            data: {
                ...createSignatureDto,
                userId,
                socialLinks: JSON.stringify(createSignatureDto.socialLinks),
            },
        });
    }
    async findAll(userId) {
        const signatures = await this.prisma.signature.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
        });
        return signatures.map((sig) => ({
            ...sig,
            socialLinks: sig.socialLinks ? JSON.parse(sig.socialLinks) : [],
        }));
    }
    async findOne(userId, id) {
        const signature = await this.prisma.signature.findUnique({
            where: { id },
        });
        if (!signature) {
            throw new common_1.NotFoundException(`Signature with ID ${id} not found`);
        }
        if (signature.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to access this signature');
        }
        return {
            ...signature,
            socialLinks: signature.socialLinks ? JSON.parse(signature.socialLinks) : [],
        };
    }
    async update(userId, id, updateSignatureDto) {
        await this.findOne(userId, id);
        return this.prisma.signature.update({
            where: { id },
            data: {
                ...updateSignatureDto,
                socialLinks: JSON.stringify(updateSignatureDto.socialLinks),
            },
        });
    }
    async remove(userId, id) {
        await this.findOne(userId, id);
        return this.prisma.signature.delete({
            where: { id },
        });
    }
};
exports.SignaturesService = SignaturesService;
exports.SignaturesService = SignaturesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SignaturesService);
//# sourceMappingURL=signatures.service.js.map