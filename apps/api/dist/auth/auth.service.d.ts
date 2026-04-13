import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    private issueTokens;
    devLogin(email: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string;
        };
        access_token: string;
        refresh_token: string;
    }>;
    register(email: string, name: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string;
        };
        access_token: string;
        refresh_token: string;
    }>;
    refresh(refreshToken: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string;
        };
        access_token: string;
        refresh_token: string;
    }>;
    logout(userId: string): Promise<void>;
    forgotPassword(email: string): Promise<{
        resetToken: string;
    }>;
    resetPassword(token: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string;
        };
        access_token: string;
        refresh_token: string;
    }>;
}
