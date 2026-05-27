import { ctaButton, emailLayout } from './layout';

export function orgInviteEmail(
  inviteeName: string,
  orgName: string,
  inviterName: string,
  role: string,
  dashboardUrl: string,
): { subject: string; html: string; text: string } {
  const subject = `You've been added to ${orgName} on Signova`;
  const html = emailLayout(
    subject,
    `
      <h1 style="margin:0 0 12px;font-size:20px;color:#18181b;">You're on the team</h1>
      <p style="margin:0 0 16px;">
        Hi ${escapeHtml(inviteeName)}, <strong>${escapeHtml(inviterName)}</strong> added you to
        <strong>${escapeHtml(orgName)}</strong> as <strong>${escapeHtml(role)}</strong>.
      </p>
      <p style="margin:0 0 16px;">Sign in to use shared branding and organization signatures.</p>
      ${ctaButton(dashboardUrl, 'Go to dashboard')}
    `,
  );
  const text = `You've been added to ${orgName} on Signova as ${role}.\n\n${dashboardUrl}`;
  return { subject, html, text };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
