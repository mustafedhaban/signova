import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createTeamDto: CreateTeamDto) {
    return this.prisma.team.create({
      data: {
        ...createTeamDto,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.team.findMany({
      where: { userId },
      include: {
        _count: {
          select: { signatures: true },
        },
      },
    });
  }

  async findOne(userId: string, id: string) {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: {
        signatures: true,
      },
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    if (team.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this team');
    }

    return team;
  }

  async importCsv(userId: string, teamId: string, members: any[]) {
    await this.findOne(userId, teamId);

    // Bulk create signatures for the team
    const signaturesData = members.map((member) => ({
      name: member.name,
      email: member.email,
      title: member.title || null,
      company: member.company || null,
      phone: member.phone || null,
      mobile: member.mobile || null,
      website: member.website || null,
      templateId: 'standard', // Default template
      userId: userId,
      teamId: teamId,
    }));

    return this.prisma.signature.createMany({
      data: signaturesData,
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.team.delete({
      where: { id },
    });
  }
}
