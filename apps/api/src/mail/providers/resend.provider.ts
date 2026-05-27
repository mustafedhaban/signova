import { Logger } from '@nestjs/common';
import { MailProvider, SendMailOptions } from '../mail.types';

export class ResendMailProvider implements MailProvider {
  private readonly logger = new Logger(ResendMailProvider.name);

  constructor(
    private readonly apiKey: string,
    private readonly from: string,
  ) {}

  async send(options: SendMailOptions): Promise<void> {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: this.from,
        to: [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      this.logger.error(`Resend failed (${response.status}): ${body}`);
      throw new Error('Failed to send email via Resend');
    }
  }
}
