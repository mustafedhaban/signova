import { AuthService } from './auth.service';
import { DevLoginDto } from './dto/dev-login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    devLogin(body: DevLoginDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string;
        };
        access_token: string;
        refresh_token: string;
    }>;
    register(body: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string;
        };
        access_token: string;
        refresh_token: string;
    }>;
    forgotPassword(body: ForgotPasswordDto): Promise<{
        resetToken: string;
    }>;
    resetPassword(body: {
        token: string;
    }): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string;
        };
        access_token: string;
        refresh_token: string;
    }>;
    refresh(body: {
        refresh_token: string;
    }): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string;
        };
        access_token: string;
        refresh_token: string;
    }>;
    logout(req: any): Promise<{
        message: string;
    }>;
    getProfile(req: any): any;
}
