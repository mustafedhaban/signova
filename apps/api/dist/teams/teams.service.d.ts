import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
export declare class TeamsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createTeamDto: CreateTeamDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    findAll(userId: string): Promise<({
        _count: {
            signatures: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    })[]>;
    findOne(userId: string, id: string): Promise<{
        signatures: {
            id: string;
            email: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            title: string | null;
            company: string | null;
            department: string | null;
            phone: string | null;
            mobile: string | null;
            website: string | null;
            address: string | null;
            logoUrl: string | null;
            socialLinks: string | null;
            templateId: string;
            userId: string;
            teamId: string | null;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    importCsv(userId: string, teamId: string, members: any[]): Promise<import(".prisma/client").Prisma.BatchPayload>;
    remove(userId: string, id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
}
