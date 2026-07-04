import { inviteEmailTemplate } from "./templates/inviteEmail";
import { sendWithMailtrap } from "./providers/mailtrap";

type EmailProvider = "mailtrap" | "resend";

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const provider = (process.env.EMAIL_PROVIDER || "mailtrap") as EmailProvider;

  switch (provider) {
    case "resend": {
      const { sendWithResend } = await import("./providers/resend");
      await sendWithResend(to, subject, html);
      break;
    }
    case "mailtrap":
    default:
      await sendWithMailtrap(to, subject, html);
      break;
  }
}

export async function sendInviteEmail(
  toEmail: string,
  inviteLink: string,
  ownerEmail: string
): Promise<void> {
  const provider = (process.env.EMAIL_PROVIDER || "mailtrap") as EmailProvider;
  const subject = `${ownerEmail} invited you to join their MultiFlix plan`;
  const html = inviteEmailTemplate(ownerEmail, inviteLink);
  await sendEmail(toEmail, subject, html);
  console.log(`✅ Invite email sent to ${toEmail} via ${provider}`);
}
