import { Injectable, ConflictException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // ─── Shared token issuer ────────────────────────────────────────────────────

  private async issueTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '1h',
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: '7d',
    });

    // Store hashed refresh token
    const hashed = crypto.createHash('sha256').update(refresh_token).digest('hex');
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashed },
    });

    return { access_token, refresh_token };
  }

  // ─── Dev login ──────────────────────────────────────────────────────────────

  async devLogin(email: string) {
    const name = email.split('@')[0];
    const dbUser = await this.prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, name, provider: 'dev' },
    });

    const tokens = await this.issueTokens(dbUser.id, dbUser.email);
    return {
      ...tokens,
      user: { id: dbUser.id, email: dbUser.email, name: dbUser.name, avatarUrl: dbUser.avatarUrl },
    };
  }

  // ─── Register ───────────────────────────────────────────────────────────────

  async register(email: string, name: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('An account with this email already exists');

    const dbUser = await this.prisma.user.create({
      data: { email, name, provider: 'dev' },
    });

    const tokens = await this.issueTokens(dbUser.id, dbUser.email);
    return {
      ...tokens,
      user: { id: dbUser.id, email: dbUser.email, name: dbUser.name, avatarUrl: dbUser.avatarUrl },
    };
  }

  // ─── Refresh token ──────────────────────────────────────────────────────────

  async refresh(refreshToken: string) {
    let payload: { sub: string; email: string };
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || !user.refreshToken) throw new UnauthorizedException('Refresh token revoked');

    const hashed = crypto.createHash('sha256').update(refreshToken).digest('hex');
    if (hashed !== user.refreshToken) throw new UnauthorizedException('Refresh token mismatch');

    const tokens = await this.issueTokens(user.id, user.email);
    return {
      ...tokens,
      user: { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl },
    };
  }

  // ─── Logout (revoke refresh token) ──────────────────────────────────────────

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  // ─── Forgot / reset password ─────────────────────────────────────────────────

  async forgotPassword(email: string): Promise<{ resetToken: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return { resetToken: '' };

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await this.prisma.user.update({
      where: { email },
      data: { resetToken, resetTokenExpiry },
    });

    return { resetToken };
  }

  async resetPassword(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { resetToken: token, resetTokenExpiry: { gt: new Date() } },
    });

    if (!user) throw new BadRequestException('Invalid or expired reset token');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetToken: null, resetTokenExpiry: null },
    });

    const tokens = await this.issueTokens(user.id, user.email);
    return {
      ...tokens,
      user: { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl },
    };
  }

  // TODO: Re-enable Google OAuth
  // async validateOAuthUser(user: any) { ... }
}
