"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto = require("crypto");
let AuthService = class AuthService {
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async issueTokens(userId, email) {
        const payload = { sub: userId, email };
        const access_token = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: '1h',
        });
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.get('REFRESH_TOKEN_SECRET'),
            expiresIn: '7d',
        });
        const hashed = crypto.createHash('sha256').update(refresh_token).digest('hex');
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: hashed },
        });
        return { access_token, refresh_token };
    }
    async devLogin(email) {
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
    async register(email, name) {
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing)
            throw new common_1.ConflictException('An account with this email already exists');
        const dbUser = await this.prisma.user.create({
            data: { email, name, provider: 'dev' },
        });
        const tokens = await this.issueTokens(dbUser.id, dbUser.email);
        return {
            ...tokens,
            user: { id: dbUser.id, email: dbUser.email, name: dbUser.name, avatarUrl: dbUser.avatarUrl },
        };
    }
    async refresh(refreshToken) {
        let payload;
        try {
            payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('REFRESH_TOKEN_SECRET'),
            });
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
        const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
        if (!user || !user.refreshToken)
            throw new common_1.UnauthorizedException('Refresh token revoked');
        const hashed = crypto.createHash('sha256').update(refreshToken).digest('hex');
        if (hashed !== user.refreshToken)
            throw new common_1.UnauthorizedException('Refresh token mismatch');
        const tokens = await this.issueTokens(user.id, user.email);
        return {
            ...tokens,
            user: { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl },
        };
    }
    async logout(userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            return { resetToken: '' };
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60);
        await this.prisma.user.update({
            where: { email },
            data: { resetToken, resetTokenExpiry },
        });
        return { resetToken };
    }
    async resetPassword(token) {
        const user = await this.prisma.user.findFirst({
            where: { resetToken: token, resetTokenExpiry: { gt: new Date() } },
        });
        if (!user)
            throw new common_1.BadRequestException('Invalid or expired reset token');
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map