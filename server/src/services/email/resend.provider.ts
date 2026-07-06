import { Resend } from 'resend';
import type { EmailProvider } from './types';

class ResendProvider implements EmailProvider {
  private client: Resend;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is required when EMAIL_PROVIDER=resend');
    }
    this.client = new Resend(apiKey);
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    const { error } = await this.client.emails.send({
      from: process.env.RESEND_FROM || 'MultiFlix <onboarding@resend.dev>',
      to,
      subject,
      html,
    });

    if (error) {
      throw new Error(`Resend error: ${error.message}`);
    }
  }
}

export function createResendProvider(): EmailProvider {
  return new ResendProvider();
}
