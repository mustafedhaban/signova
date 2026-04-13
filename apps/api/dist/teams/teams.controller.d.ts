import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
export declare class TeamsController {
    private readonly teamsService;
    constructor(teamsService: TeamsService);
    create(req: any, createTeamDto: CreateTeamDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    findAll(req: any): Promise<({
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
    findOne(req: any, id: string): Promise<{
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
            primaryColor: string | null;
            fontFamily: string | null;
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
    importCsv(req: any, id: string, body: {
        members: any[];
    }): Promise<import(".prisma/client").Prisma.BatchPayload>;
    remove(req: any, id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
}
