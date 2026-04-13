import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateBrandingDto } from './dto/update-branding.dto';
export declare class OrganizationsController {
    private readonly orgsService;
    constructor(orgsService: OrganizationsService);
    create(req: any, dto: CreateOrganizationDto): Promise<{
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
    findAll(req: any): Promise<({
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
    findOne(req: any, id: string): Promise<{
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
    update(req: any, id: string, dto: UpdateOrganizationDto): Promise<{
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
    remove(req: any, id: string): Promise<{
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
    inviteMember(req: any, id: string, dto: InviteMemberDto): Promise<{
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
    removeMember(req: any, id: string, memberId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        role: string;
        organizationId: string;
    }>;
    updateBranding(req: any, id: string, dto: UpdateBrandingDto): Promise<{
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
    updateMemberRole(req: any, id: string, memberId: string, role: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        role: string;
        organizationId: string;
    }>;
}
