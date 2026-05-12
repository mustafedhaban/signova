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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true, avatarUrl: true, provider: true, createdAt: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async updateProfile(userId, dto) {
        return this.prisma.user.update({
            where: { id: userId },
            data: dto,
            select: { id: true, email: true, name: true, avatarUrl: true, provider: true },
        });
    }
    async deleteAccount(userId) {
        await this.prisma.signature.deleteMany({ where: { userId } });
        await this.prisma.team.deleteMany({ where: { userId } });
        await this.prisma.organizationMember.deleteMany({ where: { userId } });
        await this.prisma.user.delete({ where: { id: userId } });
        return { message: 'Account deleted successfully' };
    }
    async exportData(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true, avatarUrl: true, provider: true, createdAt: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const signatures = await this.prisma.signature.findMany({
            where: { userId },
            select: { id: true, name: true, email: true, title: true, company: true, templateId: true, createdAt: true },
        });
        const teams = await this.prisma.team.findMany({
            where: { userId },
            select: { id: true, name: true, createdAt: true },
        });
        const orgMemberships = await this.prisma.organizationMember.findMany({
            where: { userId },
            include: { organization: { select: { id: true, name: true, slug: true } } },
        });
        return {
            exportedAt: new Date().toISOString(),
            user,
            signatures,
            teams,
            organizations: orgMemberships.map((m) => ({
                role: m.role,
                joinedAt: m.createdAt,
                organization: m.organization,
            })),
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map