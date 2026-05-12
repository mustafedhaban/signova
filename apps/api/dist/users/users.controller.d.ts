import { Response } from 'express';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
        id: string;
        email: string;
        name: string;
        avatarUrl: string;
        provider: string;
        createdAt: Date;
    }>;
    updateProfile(req: any, dto: UpdateProfileDto): Promise<{
        id: string;
        email: string;
        name: string;
        avatarUrl: string;
        provider: string;
    }>;
    deleteAccount(req: any): Promise<{
        message: string;
    }>;
    exportData(req: any, res: Response): Promise<void>;
}
