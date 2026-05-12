import { Controller, Get, Patch, Delete, Body, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getProfile(@Req() req) {
    return this.usersService.getProfile(req.user.userId);
  }

  @Patch('me')
  updateProfile(@Req() req, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.userId, dto);
  }

  @Delete('me')
  deleteAccount(@Req() req) {
    return this.usersService.deleteAccount(req.user.userId);
  }

  @Get('me/export')
  async exportData(@Req() req, @Res() res: Response) {
    const data = await this.usersService.exportData(req.user.userId);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="my-data.json"');
    res.send(JSON.stringify(data, null, 2));
  }
}
