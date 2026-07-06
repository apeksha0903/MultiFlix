import nodemailer from 'nodemailer';
import type { EmailProvider } from './types';

class MailtrapProvider implements EmailProvider {
  private transport: nodemailer.Transporter;

  constructor() {
    const host = process.env.MAILTRAP_HOST;
    const port = Number(process.env.MAILTRAP_PORT);
    const user = process.env.MAILTRAP_USER;
    const pass = process.env.MAILTRAP_PASS;

    if (!host || !port || !user || !pass) {
      throw new Error('Mailtrap configuration is incomplete. Check MAILTRAP_HOST, MAILTRAP_PORT, MAILTRAP_USER, and MAILTRAP_PASS.');
    }

    this.transport = nodemailer.createTransport({
      host,
      port,
      auth: { user, pass },
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    await this.transport.sendMail({
      from: '"MultiFlix" <noreply@multiflix.dev>',
      to,
      subject,
      html,
    });
  }
}

export function createMailtrapProvider(): EmailProvider {
  return new MailtrapProvider();
}
