import nodemailer from 'nodemailer';
import type { EmailProvider } from './types';

class GmailProvider implements EmailProvider {
  private transport: nodemailer.Transporter;

  constructor() {
    const user = process.env.GMAIL_USER;
    const appPassword = process.env.GMAIL_APP_PASSWORD;

    if (!user || !appPassword) {
      throw new Error('Gmail configuration is incomplete. Check GMAIL_USER and GMAIL_APP_PASSWORD.');
    }

    this.transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass: appPassword,
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    await this.transport.sendMail({
      from: `MultiFlix <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    });
  }
}

export function createGmailProvider(): EmailProvider {
  return new GmailProvider();
}
