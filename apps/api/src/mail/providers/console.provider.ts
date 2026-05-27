import { Logger } from '@nestjs/common';
import { MailProvider, SendMailOptions } from '../mail.types';

export class ConsoleMailProvider implements MailProvider {
  private readonly logger = new Logger('MailService');

  async send(options: SendMailOptions): Promise<void> {
    this.logger.log(`[console] To: ${options.to} | Subject: ${options.subject}`);
    if (options.text) {
      this.logger.log(options.text);
    }
  }
}
