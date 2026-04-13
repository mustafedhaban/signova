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
exports.OrganizationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OrganizationsService = class OrganizationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const existing = await this.prisma.organization.findUnique({ where: { slug: dto.slug } });
        if (existing)
            throw new common_1.ConflictException('An organization with this slug already exists');
        const org = await this.prisma.organization.create({
            data: {
                ...dto,
                members: { create: { userId, role: 'owner' } },
            },
            include: { members: { include: { user: true } } },
        });
        return org;
    }
    async findAllForUser(userId) {
        return this.prisma.organization.findMany({
            where: { members: { some: { userId } } },
            include: {
                _count: { select: { members: true } },
                members: { where: { userId }, select: { role: true } },
            },
        });
    }
    async findOne(userId, orgId) {
        const org = await this.prisma.organization.findUnique({
            where: { id: orgId },
            include: { members: { include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } } } },
        });
        if (!org)
            throw new common_1.NotFoundException('Organization not found');
        this.assertMember(org, userId);
        return org;
    }
    async updateBranding(userId, orgId, dto) {
        await this.assertRole(userId, orgId, ['owner', 'admin']);
        return this.prisma.organization.update({ where: { id: orgId }, data: dto });
    }
    async update(userId, orgId, dto) {
        await this.assertRole(userId, orgId, ['owner', 'admin']);
        return this.prisma.organization.update({ where: { id: orgId }, data: dto });
    }
    async remove(userId, orgId) {
        await this.assertRole(userId, orgId, ['owner']);
        return this.prisma.organization.delete({ where: { id: orgId } });
    }
    async inviteMember(userId, orgId, email, role) {
        await this.assertRole(userId, orgId, ['owner', 'admin']);
        const invitee = await this.prisma.user.findUnique({ where: { email } });
        if (!invitee)
            throw new common_1.NotFoundException('No user found with that email address');
        const existing = await this.prisma.organizationMember.findUnique({
            where: { userId_organizationId: { userId: invitee.id, organizationId: orgId } },
        });
        if (existing)
            throw new common_1.ConflictException('User is already a member of this organization');
        return this.prisma.organizationMember.create({
            data: { userId: invitee.id, organizationId: orgId, role },
            include: { user: { select: { id: true, name: true, email: true } } },
        });
    }
    async removeMember(userId, orgId, memberId) {
        await this.assertRole(userId, orgId, ['owner', 'admin']);
        const member = await this.prisma.organizationMember.findUnique({
            where: { userId_organizationId: { userId: memberId, organizationId: orgId } },
        });
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        if (member.role === 'owner') {
            const ownerCount = await this.prisma.organizationMember.count({
                where: { organizationId: orgId, role: 'owner' },
            });
            if (ownerCount <= 1)
                throw new common_1.ForbiddenException('Cannot remove the last owner');
        }
        return this.prisma.organizationMember.delete({
            where: { userId_organizationId: { userId: memberId, organizationId: orgId } },
        });
    }
    async updateMemberRole(userId, orgId, memberId, role) {
        await this.assertRole(userId, orgId, ['owner']);
        return this.prisma.organizationMember.update({
            where: { userId_organizationId: { userId: memberId, organizationId: orgId } },
            data: { role },
        });
    }
    assertMember(org, userId) {
        const isMember = org.members.some((m) => m.userId === userId);
        if (!isMember)
            throw new common_1.ForbiddenException('You are not a member of this organization');
    }
    async assertRole(userId, orgId, roles) {
        const member = await this.prisma.organizationMember.findUnique({
            where: { userId_organizationId: { userId, organizationId: orgId } },
        });
        if (!member || !roles.includes(member.role)) {
            throw new common_1.ForbiddenException('Insufficient permissions');
        }
    }
};
exports.OrganizationsService = OrganizationsService;
exports.OrganizationsService = OrganizationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrganizationsService);
//# sourceMappingURL=organizations.service.js.map