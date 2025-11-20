import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendEmail({ to, subject, html }) {
  try {
    const { data, error } = await resend.emails.send({
      from: "QupDate <noreply@qup.dating>",
      to,
      subject,
      html,
    });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Email send error:", err);
    throw err;
  }
}
