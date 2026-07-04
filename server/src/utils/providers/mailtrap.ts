import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: Number(process.env.MAILTRAP_PORT),
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

export async function sendWithMailtrap(to: string, subject: string, html: string): Promise<void> {
  await transport.sendMail({
    from: '"MultiFlix" <noreply@multiflix.dev>',
    to,
    subject,
    html,
  });
}
