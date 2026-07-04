import { Resend } from "resend";

let client: Resend | null = null;

function getResendClient(): Resend {
  if (!client) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is required when EMAIL_PROVIDER=resend");
    }
    client = new Resend(apiKey);
  }
  return client;
}

export async function sendWithResend(to: string, subject: string, html: string): Promise<void> {
  const resend = getResendClient();
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM || "MultiFlix <noreply@multiflix.dev>",
    to,
    subject,
    html,
  });
  if (error) throw new Error(`Resend error: ${error.message}`);
}
