import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        name: string;
        avatarUrl: string;
        provider: string;
        createdAt: Date;
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        id: string;
        email: string;
        name: string;
        avatarUrl: string;
        provider: string;
    }>;
    deleteAccount(userId: string): Promise<{
        message: string;
    }>;
    exportData(userId: string): Promise<{
        exportedAt: string;
        user: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string;
            provider: string;
            createdAt: Date;
        };
        signatures: {
            id: string;
            email: string;
            name: string;
            createdAt: Date;
            title: string;
            company: string;
            templateId: string;
        }[];
        teams: {
            id: string;
            name: string;
            createdAt: Date;
        }[];
        organizations: {
            role: string;
            joinedAt: Date;
            organization: {
                id: string;
                name: string;
                slug: string;
            };
        }[];
    }>;
}
