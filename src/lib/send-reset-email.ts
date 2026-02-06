import nodemailer from "nodemailer";

export async function sendPasswordResetEmail(to: string, resetLink: string): Promise<void> {
  const user = process.env.EMAIL_ID;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) {
    console.warn("Password reset email skipped: EMAIL_ID or EMAIL_PASS not set");
    return;
  }
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: { user, pass },
  });
  await transporter.sendMail({
    from: `"R3sults" <${user}>`,
    to,
    subject: "Reset your R3sults password",
    html: `
      <p>You requested a password reset. Click the link below to set a new password:</p>
      <p><a href="${resetLink}" style="color:#BF0637;font-weight:600;">Reset password</a></p>
      <p>This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>
    `,
    text: `Reset your password: ${resetLink}. This link expires in 1 hour.`,
  });
}
