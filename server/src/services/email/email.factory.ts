import { createGmailProvider } from './gmail.provider';
import { createMailtrapProvider } from './mailtrap.provider';
import { createResendProvider } from './resend.provider';
import type { EmailProvider, EmailProviderName } from './types';

export function createEmailProvider(providerName?: string): EmailProvider {
  const provider = (providerName || process.env.EMAIL_PROVIDER || 'mailtrap').toLowerCase() as EmailProviderName;

  switch (provider) {
    case 'resend':
      return createResendProvider();
    case 'gmail': {
      try {
        return createGmailProvider();
      } catch (error) {
        console.warn('Gmail provider unavailable, falling back to Mailtrap:', error);
        return createMailtrapProvider();
      }
    }
    case 'mailtrap':
    default:
      return createMailtrapProvider();
  }
}
