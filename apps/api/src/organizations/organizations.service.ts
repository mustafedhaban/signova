import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  // ─── Create org (creator becomes owner) ─────────────────────────────────────
  async create(userId: string, dto: CreateOrganizationDto) {
    const existing = await this.prisma.organization.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException('An organization with this slug already exists');

    const org = await this.prisma.organization.create({
      data: {
        ...dto,
        members: { create: { userId, role: 'owner' } },
      },
      include: { members: { include: { user: true } } },
    });
    return org;
  }

  // ─── List orgs for user ──────────────────────────────────────────────────────
  async findAllForUser(userId: string) {
    return this.prisma.organization.findMany({
      where: { members: { some: { userId } } },
      include: {
        _count: { select: { members: true } },
        members: { where: { userId }, select: { role: true } },
      },
    });
  }

  // ─── Get single org ──────────────────────────────────────────────────────────
  async findOne(userId: string, orgId: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id: orgId },
      include: { members: { include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } } } },
    });
    if (!org) throw new NotFoundException('Organization not found');
    this.assertMember(org, userId);
    return org;
  }

  // ─── Update branding ─────────────────────────────────────────────────────────
  async updateBranding(userId: string, orgId: string, dto: any) {
    await this.assertRole(userId, orgId, ['owner', 'admin']);
    return this.prisma.organization.update({ where: { id: orgId }, data: dto });
  }

  // ─── Update org (admin/owner only) ──────────────────────────────────────────
  async update(userId: string, orgId: string, dto: UpdateOrganizationDto) {
    await this.assertRole(userId, orgId, ['owner', 'admin']);
    return this.prisma.organization.update({ where: { id: orgId }, data: dto });
  }

  // ─── Delete org (owner only) ─────────────────────────────────────────────────
  async remove(userId: string, orgId: string) {
    await this.assertRole(userId, orgId, ['owner']);
    return this.prisma.organization.delete({ where: { id: orgId } });
  }

  // ─── Invite member ───────────────────────────────────────────────────────────
  async inviteMember(userId: string, orgId: string, email: string, role: string) {
    await this.assertRole(userId, orgId, ['owner', 'admin']);

    const invitee = await this.prisma.user.findUnique({ where: { email } });
    if (!invitee) throw new NotFoundException('No user found with that email address');

    const existing = await this.prisma.organizationMember.findUnique({
      where: { userId_organizationId: { userId: invitee.id, organizationId: orgId } },
    });
    if (existing) throw new ConflictException('User is already a member of this organization');

    return this.prisma.organizationMember.create({
      data: { userId: invitee.id, organizationId: orgId, role },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }

  // ─── Remove member ───────────────────────────────────────────────────────────
  async removeMember(userId: string, orgId: string, memberId: string) {
    await this.assertRole(userId, orgId, ['owner', 'admin']);

    const member = await this.prisma.organizationMember.findUnique({
      where: { userId_organizationId: { userId: memberId, organizationId: orgId } },
    });
    if (!member) throw new NotFoundException('Member not found');

    // Prevent removing the last owner
    if (member.role === 'owner') {
      const ownerCount = await this.prisma.organizationMember.count({
        where: { organizationId: orgId, role: 'owner' },
      });
      if (ownerCount <= 1) throw new ForbiddenException('Cannot remove the last owner');
    }

    return this.prisma.organizationMember.delete({
      where: { userId_organizationId: { userId: memberId, organizationId: orgId } },
    });
  }

  // ─── Update member role ──────────────────────────────────────────────────────
  async updateMemberRole(userId: string, orgId: string, memberId: string, role: string) {
    await this.assertRole(userId, orgId, ['owner']);
    return this.prisma.organizationMember.update({
      where: { userId_organizationId: { userId: memberId, organizationId: orgId } },
      data: { role },
    });
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  private assertMember(org: any, userId: string) {
    const isMember = org.members.some((m: any) => m.userId === userId);
    if (!isMember) throw new ForbiddenException('You are not a member of this organization');
  }

  private async assertRole(userId: string, orgId: string, roles: string[]) {
    const member = await this.prisma.organizationMember.findUnique({
      where: { userId_organizationId: { userId, organizationId: orgId } },
    });
    if (!member || !roles.includes(member.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }
  }
}
