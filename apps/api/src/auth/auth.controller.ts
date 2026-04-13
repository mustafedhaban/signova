import { Controller, Get, Post, Req, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { DevLoginDto } from './dto/dev-login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  // TODO: Re-enable Google OAuth
  // @Get('google')
  // @UseGuards(AuthGuard('google'))
  // async googleAuth(@Req() req) {}
  // TODO: Re-enable Google OAuth

  // TODO: Re-enable Google OAuth
  // @Get('google/callback')
  // @UseGuards(AuthGuard('google'))
  // async googleAuthRedirect(@Req() req, @Res() res: Response) {
  //   const authData = await this.authService.validateOAuthUser(req.user);
  //
  //   const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
  //   res.redirect(`${frontendUrl}/auth-callback?token=${authData.access_token}`);
  // }
  // TODO: Re-enable Google OAuth

  @Post('dev-login')
  async devLogin(@Body() body: DevLoginDto) {
    return this.authService.devLogin(body.email);
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body.email, body.name);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string }) {
    return this.authService.resetPassword(body.token);
  }

  @Post('refresh')
  async refresh(@Body() body: { refresh_token: string }) {
    return this.authService.refresh(body.refresh_token);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Req() req) {
    await this.authService.logout(req.user.userId);
    return { message: 'Logged out successfully' };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req) {
    return req.user;
  }
}
