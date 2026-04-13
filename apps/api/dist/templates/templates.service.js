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
exports.TemplatesService = exports.BUILTIN_TEMPLATES = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
exports.BUILTIN_TEMPLATES = [
    { id: 'standard', name: 'Professional Classic', description: 'Traditional side-by-side layout', category: 'professional', isPublic: true, thumbnailUrl: null },
    { id: 'modern', name: 'Modern Minimal', description: 'Clean design with blue accent bar', category: 'modern', isPublic: true, thumbnailUrl: null },
    { id: 'corporate', name: 'Corporate Bold', description: 'Dark navy panel with colored border', category: 'corporate', isPublic: true, thumbnailUrl: null },
];
let TemplatesService = class TemplatesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId, orgId) {
        const dbTemplates = await this.prisma.template.findMany({
            where: {
                OR: [
                    { isPublic: true },
                    ...(orgId ? [{ organizationId: orgId }] : []),
                ],
            },
            orderBy: { createdAt: 'asc' },
        });
        return [...exports.BUILTIN_TEMPLATES, ...dbTemplates];
    }
    async findOne(id) {
        const builtin = exports.BUILTIN_TEMPLATES.find((t) => t.id === id);
        if (builtin)
            return builtin;
        const template = await this.prisma.template.findUnique({ where: { id } });
        if (!template)
            throw new common_1.NotFoundException('Template not found');
        return template;
    }
    async create(dto) {
        return this.prisma.template.create({ data: dto });
    }
    async duplicate(id, userId) {
        const source = await this.findOne(id);
        return this.prisma.template.create({
            data: {
                name: `${source.name} (Copy)`,
                description: source.description ?? undefined,
                category: source.category ?? undefined,
                thumbnailUrl: source.thumbnailUrl ?? undefined,
                isPublic: false,
            },
        });
    }
    async remove(id) {
        if (exports.BUILTIN_TEMPLATES.find((t) => t.id === id)) {
            throw new common_1.ForbiddenException('Cannot delete built-in templates');
        }
        const template = await this.prisma.template.findUnique({ where: { id } });
        if (!template)
            throw new common_1.NotFoundException('Template not found');
        return this.prisma.template.delete({ where: { id } });
    }
};
exports.TemplatesService = TemplatesService;
exports.TemplatesService = TemplatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TemplatesService);
//# sourceMappingURL=templates.service.js.map