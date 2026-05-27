export type ExportGuideTab = 'gmail' | 'outlook' | 'apple-mail' | 'html';

export interface ExportModalGuide {
  id: ExportGuideTab;
  label: string;
  title: string;
  steps: string[];
}

export const EXPORT_MODAL_GUIDES: ExportModalGuide[] = [
  {
    id: 'gmail',
    label: 'Gmail',
    title: 'How to install in Gmail',
    steps: [
      'Open your email client settings.',
      "Navigate to the 'Signature' section.",
      'Click the button below to copy the signature to your clipboard.',
      'Paste (Cmd/Ctrl + V) into the signature field and save.',
    ],
  },
  {
    id: 'outlook',
    label: 'Outlook',
    title: 'How to install in Outlook',
    steps: [
      'Open Outlook settings → Mail → Signatures (desktop: File → Options → Mail → Signatures).',
      'Create a new signature and give it a name.',
      'Click the button below to copy the signature to your clipboard.',
      'Paste into the signature editor and set it as the default for new messages.',
    ],
  },
  {
    id: 'apple-mail',
    label: 'Apple Mail',
    title: 'How to install in Apple Mail',
    steps: [
      'Open Mail → Settings → Signatures and select your account.',
      'Click + to add a new signature.',
      'Click the button below to copy the signature to your clipboard.',
      'Paste into the signature pane and close settings.',
    ],
  },
  {
    id: 'html',
    label: 'HTML',
    title: 'How to use HTML export',
    steps: [
      'Click Copy Signature below to copy rich HTML to your clipboard.',
      'Optional: use Download .html below for a backup file.',
      'Open the .html file in a browser if needed, then copy the rendered preview.',
      'Paste into any email client that supports HTML signatures.',
    ],
  },
];
