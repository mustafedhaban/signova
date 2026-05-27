import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailProvider, MailProviderKind } from './mail.types';
import { ConsoleMailProvider } from './providers/console.provider';
import { ResendMailProvider } from './providers/resend.provider';
import { SmtpMailProvider } from './providers/smtp.provider';
import { welcomeEmail } from './templates/welcome.template';
import { passwordResetEmail } from './templates/password-reset.template';
import { orgInviteEmail } from './templates/org-invite.template';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly provider: MailProvider;
  readonly providerKind: MailProviderKind;
  private readonly frontendUrl: string;

  constructor(private configService: ConfigService) {
    this.frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    const from =
      this.configService.get<string>('MAIL_FROM') || 'Signova <noreply@signova.local>';

    const configured = (this.configService.get<string>('MAIL_PROVIDER') || '').toLowerCase();
    const resendKey = this.configService.get<string>('RESEND_API_KEY');
    const smtpHost = this.configService.get<string>('SMTP_HOST');

    if (configured === 'resend' || (!configured && resendKey)) {
      if (!resendKey) {
        this.logger.warn('MAIL_PROVIDER=resend but RESEND_API_KEY is missing; using console');
        this.provider = new ConsoleMailProvider();
        this.providerKind = 'console';
      } else {
        this.provider = new ResendMailProvider(resendKey, from);
        this.providerKind = 'resend';
        this.logger.log('Mail provider: Resend');
      }
    } else if (configured === 'smtp' || (!configured && smtpHost)) {
      if (!smtpHost) {
        this.provider = new ConsoleMailProvider();
        this.providerKind = 'console';
      } else {
        this.provider = new SmtpMailProvider(from, {
          host: smtpHost,
          port: Number(this.configService.get<string>('SMTP_PORT') || 587),
          secure: this.configService.get<string>('SMTP_SECURE') === 'true',
          user: this.configService.get<string>('SMTP_USER'),
          pass: this.configService.get<string>('SMTP_PASS'),
        });
        this.providerKind = 'smtp';
        this.logger.log(`Mail provider: SMTP (${smtpHost})`);
      }
    } else {
      this.provider = new ConsoleMailProvider();
      this.providerKind = 'console';
      this.logger.log('Mail provider: console (set RESEND_API_KEY or SMTP_HOST to send real email)');
    }
  }

  isConsoleMode(): boolean {
    return this.providerKind === 'console';
  }

  private async sendSafe(fn: () => Promise<void>): Promise<void> {
    try {
      await fn();
    } catch (err) {
      this.logger.error('Email delivery failed', err);
    }
  }

  async sendWelcome(to: string, name: string): Promise<void> {
    const loginUrl = `${this.frontendUrl}/login`;
    const { subject, html, text } = welcomeEmail(name, loginUrl);
    await this.sendSafe(() => this.provider.send({ to, subject, html, text }));
  }

  async sendPasswordReset(to: string, name: string, token: string): Promise<string> {
    const resetUrl = `${this.frontendUrl}/reset-password?token=${token}`;
    const { subject, html, text } = passwordResetEmail(name, resetUrl);
    await this.sendSafe(() => this.provider.send({ to, subject, html, text }));
    return resetUrl;
  }

  async sendOrgInvite(
    to: string,
    inviteeName: string,
    orgName: string,
    inviterName: string,
    role: string,
  ): Promise<void> {
    const dashboardUrl = `${this.frontendUrl}/organizations`;
    const { subject, html, text } = orgInviteEmail(
      inviteeName,
      orgName,
      inviterName,
      role,
      dashboardUrl,
    );
    await this.sendSafe(() => this.provider.send({ to, subject, html, text }));
  }
}
