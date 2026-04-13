import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
export declare class OrganizationsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateOrganizationDto): Promise<{
        members: ({
            user: {
                id: string;
                email: string;
                name: string;
                avatarUrl: string | null;
                provider: string;
                resetToken: string | null;
                resetTokenExpiry: Date | null;
                refreshToken: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            role: string;
            organizationId: string;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        website: string | null;
        logoUrl: string | null;
        slug: string;
        primaryColor: string | null;
        bannerUrl: string | null;
        secondaryColor: string | null;
        fontFamily: string | null;
        fontSize: string | null;
    }>;
    findAllForUser(userId: string): Promise<({
        _count: {
            members: number;
        };
        members: {
            role: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        website: string | null;
        logoUrl: string | null;
        slug: string;
        primaryColor: string | null;
        bannerUrl: string | null;
        secondaryColor: string | null;
        fontFamily: string | null;
        fontSize: string | null;
    })[]>;
    findOne(userId: string, orgId: string): Promise<{
        members: ({
            user: {
                id: string;
                email: string;
                name: string;
                avatarUrl: string;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            role: string;
            organizationId: string;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        website: string | null;
        logoUrl: string | null;
        slug: string;
        primaryColor: string | null;
        bannerUrl: string | null;
        secondaryColor: string | null;
        fontFamily: string | null;
        fontSize: string | null;
    }>;
    updateBranding(userId: string, orgId: string, dto: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        website: string | null;
        logoUrl: string | null;
        slug: string;
        primaryColor: string | null;
        bannerUrl: string | null;
        secondaryColor: string | null;
        fontFamily: string | null;
        fontSize: string | null;
    }>;
    update(userId: string, orgId: string, dto: UpdateOrganizationDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        website: string | null;
        logoUrl: string | null;
        slug: string;
        primaryColor: string | null;
        bannerUrl: string | null;
        secondaryColor: string | null;
        fontFamily: string | null;
        fontSize: string | null;
    }>;
    remove(userId: string, orgId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        website: string | null;
        logoUrl: string | null;
        slug: string;
        primaryColor: string | null;
        bannerUrl: string | null;
        secondaryColor: string | null;
        fontFamily: string | null;
        fontSize: string | null;
    }>;
    inviteMember(userId: string, orgId: string, email: string, role: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        role: string;
        organizationId: string;
    }>;
    removeMember(userId: string, orgId: string, memberId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        role: string;
        organizationId: string;
    }>;
    updateMemberRole(userId: string, orgId: string, memberId: string, role: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        role: string;
        organizationId: string;
    }>;
    private assertMember;
    private assertRole;
}
