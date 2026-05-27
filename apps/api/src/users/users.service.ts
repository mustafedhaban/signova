import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        provider: true,
        createdAt: true,
        passwordHash: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    const { passwordHash, ...rest } = user;
    return { ...rest, hasPassword: !!passwordHash };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: { id: true, email: true, name: true, avatarUrl: true, provider: true },
    });
  }

  async deleteAccount(userId: string) {
    // Delete all user data in order (signatures, team memberships, org memberships)
    await this.prisma.signature.deleteMany({ where: { userId } });
    await this.prisma.team.deleteMany({ where: { userId } });
    await this.prisma.organizationMember.deleteMany({ where: { userId } });
    await this.prisma.user.delete({ where: { id: userId } });
    return { message: 'Account deleted successfully' };
  }

  async exportData(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, avatarUrl: true, provider: true, createdAt: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const signatures = await this.prisma.signature.findMany({
      where: { userId },
      select: { id: true, name: true, email: true, title: true, company: true, templateId: true, createdAt: true },
    });

    const teams = await this.prisma.team.findMany({
      where: { userId },
      select: { id: true, name: true, createdAt: true },
    });

    const orgMemberships = await this.prisma.organizationMember.findMany({
      where: { userId },
      include: { organization: { select: { id: true, name: true, slug: true } } },
    });

    return {
      exportedAt: new Date().toISOString(),
      user,
      signatures,
      teams,
      organizations: orgMemberships.map((m) => ({
        role: m.role,
        joinedAt: m.createdAt,
        organization: m.organization,
      })),
    };
  }
}
