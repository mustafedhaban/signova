import { PrismaService } from '../prisma/prisma.service';
import { CreateTemplateDto } from './dto/create-template.dto';
export declare const BUILTIN_TEMPLATES: {
    id: string;
    name: string;
    description: string;
    category: string;
    isPublic: boolean;
    thumbnailUrl: any;
}[];
export declare class TemplatesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string, orgId?: string): Promise<{
        id: string;
        name: string;
        description: string;
        category: string;
        isPublic: boolean;
        thumbnailUrl: any;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        description: string;
        category: string;
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
        thumbnailUrl: string | null;
        isPublic: boolean;
    }>;
    duplicate(id: string, userId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string | null;
        description: string | null;
        category: string | null;
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
        thumbnailUrl: string | null;
        isPublic: boolean;
    }>;
}
