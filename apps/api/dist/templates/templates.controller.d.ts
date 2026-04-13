import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
export declare class TemplatesController {
    private readonly templatesService;
    constructor(templatesService: TemplatesService);
    findAll(req: any, orgId?: string, category?: string, tag?: string): Promise<{
        id: string;
        name: string;
        description: string;
        category: string;
        tags: string;
        isPublic: boolean;
        thumbnailUrl: any;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        description: string;
        category: string;
        tags: string;
        isPublic: boolean;
        thumbnailUrl: any;
    }>;
    create(dto: CreateTemplateDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string | null;
        description: string | null;
        category: string | null;
        tags: string | null;
        thumbnailUrl: string | null;
        isPublic: boolean;
    }>;
    duplicate(req: any, id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string | null;
        description: string | null;
        category: string | null;
        tags: string | null;
        thumbnailUrl: string | null;
        isPublic: boolean;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string | null;
        description: string | null;
        category: string | null;
        tags: string | null;
        thumbnailUrl: string | null;
        isPublic: boolean;
    }>;
}
