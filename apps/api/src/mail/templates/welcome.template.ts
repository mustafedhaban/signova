import { ctaButton, emailLayout } from './layout';

export function welcomeEmail(name: string, loginUrl: string): { subject: string; html: string; text: string } {
  const subject = 'Welcome to Signova';
  const html = emailLayout(
    subject,
    `
      <h1 style="margin:0 0 12px;font-size:20px;color:#18181b;">Welcome, ${escapeHtml(name)}!</h1>
      <p style="margin:0 0 16px;">Your account is ready. Create polished email signatures for your team in minutes.</p>
      ${ctaButton(loginUrl, 'Open Signova')}
      <p style="margin:24px 0 0;font-size:13px;color:#71717a;">If you did not create this account, you can ignore this email.</p>
    `,
  );
  const text = `Welcome to Signova, ${name}!\n\nOpen your dashboard: ${loginUrl}`;
  return { subject, html, text };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
