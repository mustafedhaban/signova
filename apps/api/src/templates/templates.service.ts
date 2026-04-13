import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTemplateDto } from './dto/create-template.dto';

// Built-in templates seeded in memory (no DB row needed)
export const BUILTIN_TEMPLATES = [
  { id: 'standard',  name: 'Professional Classic', description: 'Traditional side-by-side layout',     category: 'professional', tags: '["classic","formal","ngo"]',    isPublic: true, thumbnailUrl: null },
  { id: 'modern',    name: 'Modern Minimal',        description: 'Clean design with blue accent bar',   category: 'modern',       tags: '["minimal","clean","modern"]',  isPublic: true, thumbnailUrl: null },
  { id: 'corporate', name: 'Corporate Bold',        description: 'Dark navy panel with colored border', category: 'corporate',    tags: '["bold","corporate","formal"]', isPublic: true, thumbnailUrl: null },
  { id: 'creative',  name: 'Creative Colorful',     description: 'Vibrant gradient design',             category: 'creative',     tags: '["colorful","creative","ngo"]', isPublic: true, thumbnailUrl: null },
  { id: 'executive', name: 'Executive Formal',      description: 'Conservative gold-accented layout',   category: 'executive',    tags: '["formal","executive","ngo"]',  isPublic: true, thumbnailUrl: null },
  { id: 'tech',      name: 'Tech Startup',          description: 'Dark terminal-inspired design',       category: 'tech',         tags: '["tech","startup","modern"]',   isPublic: true, thumbnailUrl: null },
];

@Injectable()
export class TemplatesService {
  constructor(private prisma: PrismaService) {}

  // List all public + org-specific templates, optionally filtered by category or tag
  async findAll(userId: string, orgId?: string, category?: string, tag?: string) {
    const dbTemplates = await this.prisma.template.findMany({
      where: {
        OR: [
          { isPublic: true },
          ...(orgId ? [{ organizationId: orgId }] : []),
        ],
      },
      orderBy: { createdAt: 'asc' },
    });

    let all = [...BUILTIN_TEMPLATES, ...dbTemplates];

    if (category) {
      all = all.filter((t) => t.category === category);
    }

    if (tag) {
      all = all.filter((t) => {
        if (!t.tags) return false;
        try {
          const parsed: string[] = JSON.parse(t.tags);
          return parsed.includes(tag);
        } catch {
          return false;
        }
      });
    }

    return all;
  }

  async findOne(id: string) {
    // Check builtins first
    const builtin = BUILTIN_TEMPLATES.find((t) => t.id === id);
    if (builtin) return builtin;

    const template = await this.prisma.template.findUnique({ where: { id } });
    if (!template) throw new NotFoundException('Template not found');
    return template;
  }

  async create(dto: CreateTemplateDto) {
    return this.prisma.template.create({ data: dto });
  }

  async duplicate(id: string, userId: string) {
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

  async remove(id: string) {
    // Cannot delete builtins
    if (BUILTIN_TEMPLATES.find((t) => t.id === id)) {
      throw new ForbiddenException('Cannot delete built-in templates');
    }
    const template = await this.prisma.template.findUnique({ where: { id } });
    if (!template) throw new NotFoundException('Template not found');
    return this.prisma.template.delete({ where: { id } });
  }
}
