const STORAGE_KEY = 'signova:last-signature-html';

export function setLastSignatureHtml(html: string): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, html);
  } catch {
    // private mode / quota
  }
}

export function getLastSignatureHtml(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export async function copyHtmlToClipboard(html?: string): Promise<boolean> {
  const content = html ?? getLastSignatureHtml();
  if (!content) return false;

  try {
    const blob = new Blob([content], { type: 'text/html' });
    await navigator.clipboard.write([new ClipboardItem({ 'text/html': blob })]);
    return true;
  } catch {
    return false;
  }
}
