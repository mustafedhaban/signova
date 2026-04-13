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
exports.TeamsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TeamsService = class TeamsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createTeamDto) {
        return this.prisma.team.create({
            data: {
                ...createTeamDto,
                userId,
            },
        });
    }
    async findAll(userId) {
        return this.prisma.team.findMany({
            where: { userId },
            include: {
                _count: {
                    select: { signatures: true },
                },
            },
        });
    }
    async findOne(userId, id) {
        const team = await this.prisma.team.findUnique({
            where: { id },
            include: {
                signatures: true,
            },
        });
        if (!team) {
            throw new common_1.NotFoundException(`Team with ID ${id} not found`);
        }
        if (team.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to access this team');
        }
        return team;
    }
    async importCsv(userId, teamId, members) {
        await this.findOne(userId, teamId);
        const signaturesData = members.map((member) => ({
            name: member.name,
            email: member.email,
            title: member.title || null,
            company: member.company || null,
            phone: member.phone || null,
            mobile: member.mobile || null,
            website: member.website || null,
            templateId: 'standard',
            userId: userId,
            teamId: teamId,
        }));
        return this.prisma.signature.createMany({
            data: signaturesData,
        });
    }
    async remove(userId, id) {
        await this.findOne(userId, id);
        return this.prisma.team.delete({
            where: { id },
        });
    }
};
exports.TeamsService = TeamsService;
exports.TeamsService = TeamsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TeamsService);
//# sourceMappingURL=teams.service.js.map