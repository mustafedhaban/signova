import { Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailProvider, SendMailOptions } from '../mail.types';

export class SmtpMailProvider implements MailProvider {
  private readonly logger = new Logger(SmtpMailProvider.name);
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly from: string,
    config: {
      host: string;
      port: number;
      secure: boolean;
      user?: string;
      pass?: string;
    },
  ) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.user ? { user: config.user, pass: config.pass } : undefined,
    });
  }

  async send(options: SendMailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });
    } catch (err) {
      this.logger.error('SMTP send failed', err);
      throw new Error('Failed to send email via SMTP');
    }
  }
}
