import { ctaButton, emailLayout } from './layout';

export function passwordResetEmail(
  name: string,
  resetUrl: string,
): { subject: string; html: string; text: string } {
  const subject = 'Reset your Signova password';
  const html = emailLayout(
    subject,
    `
      <h1 style="margin:0 0 12px;font-size:20px;color:#18181b;">Reset your password</h1>
      <p style="margin:0 0 16px;">Hi ${escapeHtml(name)}, we received a request to reset your Signova password. This link expires in 1 hour.</p>
      ${ctaButton(resetUrl, 'Reset password')}
      <p style="margin:24px 0 0;font-size:13px;color:#71717a;">If you did not request this, you can safely ignore this email.</p>
    `,
  );
  const text = `Reset your Signova password\n\n${resetUrl}\n\nThis link expires in 1 hour.`;
  return { subject, html, text };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
