import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.SMTP_HOST) {
    console.warn("SMTP_HOST not set. Mocking email delivery to:", to);
    console.log("Subject:", subject);
    console.log("HTML:", html);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || '"Portfolio Admin" <noreply@portfolio.com>',
    to,
    subject,
    html,
  });
}
