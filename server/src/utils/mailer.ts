import { inviteEmailTemplate } from "./templates/inviteEmail";
import { createEmailProvider } from "../services/email";

export async function sendInviteEmail(
  toEmail: string,
  inviteLink: string,
  ownerEmail: string
): Promise<void> {
  const providerName = process.env.EMAIL_PROVIDER || "mailtrap";
  const subject = `${ownerEmail} invited you to join their MultiFlix plan`;
  const html = inviteEmailTemplate(ownerEmail, inviteLink);

  const provider = createEmailProvider(providerName);
  await provider.sendEmail(toEmail, subject, html);

  console.log(`✅ Invite email sent to ${toEmail} via ${providerName}`);
}
