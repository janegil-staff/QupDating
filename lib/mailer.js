// lib/mailer.js
import nodemailer from "nodemailer";

export async function sendVerificationEmail(email, token) {
    console.log(process.env.SMTP_USER);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const url = `${process.env.NEXTAUTH_URL}/verify?token=${token}`;

  await transporter.sendMail({
    from: '"Qup Dating" <no-reply@qup.com>',
    to: email,
    subject: "Verify your email",
    html: `<p>Click <a href="${url}">here</a> to verify your account.</p>`,
  });
}
