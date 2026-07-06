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

    const port = Number(process.env.GMAIL_PORT || 587);
    const secure = process.env.GMAIL_SECURE === 'true' || (port === 465 && process.env.GMAIL_SECURE !== 'false');

    this.transport = nodemailer.createTransport({
      host: process.env.GMAIL_HOST || 'smtp.gmail.com',
      port,
      secure,
      requireTLS: true,
      auth: {
        user,
        pass: appPassword,
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
      tls: {
        rejectUnauthorized: true,
        minVersion: 'TLSv1.2',
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.transport.sendMail({
        from: `MultiFlix <${process.env.GMAIL_USER}>`,
        to,
        subject,
        html,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Gmail email delivery failed: ${message}`);
    }
  }
}

export function createGmailProvider(): EmailProvider {
  return new GmailProvider();
}
