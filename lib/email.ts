import nodemailer from 'nodemailer';

/**
 * Transactional email through Gmail SMTP.
 *
 * Configure with:
 *   SMTP_USER     the Gmail address that sends (e.g. contactnexvra@gmail.com)
 *   SMTP_PASSWORD a Google "App Password" for that account (NOT the login password)
 *   SMTP_FROM     optional display From, defaults to "Nexvra Solutions <SMTP_USER>"
 */
export class EmailNotConfiguredError extends Error {}

function getTransport() {
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASSWORD?.trim();
  if (!user || !pass) {
    throw new EmailNotConfiguredError('Email sending is not configured. Set SMTP_USER and SMTP_PASSWORD.');
  }
  return {
    transporter: nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
    }),
    from: process.env.SMTP_FROM?.trim() || `Nexvra Solutions <${user}>`,
  };
}

export function isEmailConfigured() {
  return Boolean(process.env.SMTP_USER?.trim() && process.env.SMTP_PASSWORD?.trim());
}

/** Sends the password-reset code. The code is never logged. */
export async function sendPasswordResetOtp(to: string, code: string, minutes: number) {
  const { transporter, from } = getTransport();
  const text =
    `Your Nexvra Solutions admin password reset code is: ${code}\n\n` +
    `It expires in ${minutes} minutes. If you did not request this, you can ignore this email.`;
  const html =
    `<div style="font-family:system-ui,Arial,sans-serif;max-width:480px;margin:0 auto;color:#0a0a0a">` +
    `<p style="font-size:13px;letter-spacing:.2em;text-transform:uppercase;color:#5c9400;font-weight:600">Nexvra Solutions</p>` +
    `<h2 style="margin:8px 0 16px">Password reset code</h2>` +
    `<p>Use this code to reset your admin password:</p>` +
    `<p style="font-size:32px;font-weight:700;letter-spacing:8px;background:#f5f5f5;border-radius:12px;padding:16px;text-align:center">${code}</p>` +
    `<p style="color:#555">It expires in ${minutes} minutes. If you did not request this, you can ignore this email.</p>` +
    `</div>`;
  await transporter.sendMail({ from, to, subject: 'Your password reset code', text, html });
}
