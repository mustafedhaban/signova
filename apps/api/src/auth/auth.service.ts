import { Injectable, ConflictException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';
import { hashPassword, verifyPassword } from './password.util';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
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
      user: this.toPublicUser(dbUser),
    };
  }

  // ─── Register ───────────────────────────────────────────────────────────────

  async register(email: string, name: string, password: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('An account with this email already exists');

    const passwordHash = await hashPassword(password);
    const dbUser = await this.prisma.user.create({
      data: { email, name, provider: 'local', passwordHash },
    });

    const tokens = await this.issueTokens(dbUser.id, dbUser.email);
    void this.mailService.sendWelcome(dbUser.email, dbUser.name);
    return {
      ...tokens,
      user: this.toPublicUser(dbUser),
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user?.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid email or password');

    const tokens = await this.issueTokens(user.id, user.email);
    return { ...tokens, user: this.toPublicUser(user) };
  }

  async changePassword(userId: string, currentPassword: string | undefined, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    if (user.passwordHash) {
      if (!currentPassword) {
        throw new BadRequestException('Current password is required');
      }
      const valid = await verifyPassword(currentPassword, user.passwordHash);
      if (!valid) throw new BadRequestException('Current password is incorrect');
    }

    const passwordHash = await hashPassword(newPassword);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return { message: 'Password updated successfully' };
  }

  private toPublicUser(user: {
    id: string;
    email: string;
    name: string;
    avatarUrl: string | null;
    provider: string;
    passwordHash?: string | null;
    createdAt?: Date;
  }) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      provider: user.provider,
      hasPassword: !!user.passwordHash,
      ...(user.createdAt ? { createdAt: user.createdAt } : {}),
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
      user: this.toPublicUser(user),
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    return this.toPublicUser(user);
  }

  // ─── Logout (revoke refresh token) ──────────────────────────────────────────

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  // ─── Forgot / reset password ─────────────────────────────────────────────────

  async forgotPassword(email: string): Promise<{ message: string; devResetUrl?: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    const message =
      'If an account exists for that email, we sent password reset instructions.';

    if (!user) {
      return { message };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await this.prisma.user.update({
      where: { email },
      data: { resetToken, resetTokenExpiry },
    });

    const devResetUrl = await this.mailService.sendPasswordReset(
      user.email,
      user.name,
      resetToken,
    );

    if (this.mailService.isConsoleMode()) {
      return { message, devResetUrl };
    }

    return { message };
  }

  async resetPassword(token: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: { resetToken: token, resetTokenExpiry: { gt: new Date() } },
    });

    if (!user) throw new BadRequestException('Invalid or expired reset token');

    const passwordHash = await hashPassword(password);
    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: { resetToken: null, resetTokenExpiry: null, passwordHash },
    });

    const tokens = await this.issueTokens(updated.id, updated.email);
    return {
      ...tokens,
      user: this.toPublicUser(updated),
    };
  }

  // TODO: Re-enable Google OAuth
  // async validateOAuthUser(user: any) { ... }
}
