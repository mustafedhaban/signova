import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSignatureDto, UpdateSignatureDto } from './dto/create-signature.dto';

@Injectable()
export class SignaturesService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async create(userId: string, createSignatureDto: CreateSignatureDto) {
    return this.prisma.signature.create({
      data: {
        ...createSignatureDto,
        userId,
        socialLinks: JSON.stringify(createSignatureDto.socialLinks),
      },
    });
  }

  async findAll(userId: string) {
    const signatures = await this.prisma.signature.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    return signatures.map((sig) => ({
      ...sig,
      socialLinks: sig.socialLinks ? JSON.parse(sig.socialLinks) : [],
    }));
  }

  async findOne(userId: string, id: string) {
    const signature = await this.prisma.signature.findUnique({
      where: { id },
    });

    if (!signature) {
      throw new NotFoundException(`Signature with ID ${id} not found`);
    }

    if (signature.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this signature');
    }

    return {
      ...signature,
      socialLinks: signature.socialLinks ? JSON.parse(signature.socialLinks) : [],
    };
  }

  async update(userId: string, id: string, updateSignatureDto: UpdateSignatureDto) {
    await this.findOne(userId, id);

    return this.prisma.signature.update({
      where: { id },
      data: {
        ...updateSignatureDto,
        socialLinks: JSON.stringify(updateSignatureDto.socialLinks),
      },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.signature.delete({ where: { id } });
  }

  async generateShareLink(userId: string, id: string): Promise<{ url: string }> {
    const signature = await this.findOne(userId, id);
    const payload = {
      name: signature.name,
      title: signature.title,
      company: signature.company,
      email: signature.email,
      phone: signature.phone,
      mobile: signature.mobile,
      website: signature.website,
      logoUrl: signature.logoUrl,
      templateId: signature.templateId,
      socialLinks: signature.socialLinks,
    };
    const token = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    return { url: `${frontendUrl}/shared/${token}` };
  }

  decodeShareToken(token: string) {
    try {
      const json = Buffer.from(token, 'base64url').toString('utf-8');
      return JSON.parse(json);
    } catch {
      throw new BadRequestException('Invalid share token');
    }
  }
}
