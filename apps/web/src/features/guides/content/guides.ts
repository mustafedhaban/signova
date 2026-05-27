import type { GuideId, InstallationGuide } from '../types';

const sharedPrereq = [
  'A finished signature saved in Signova (or copied from the Builder).',
  'Use “Copy HTML to Clipboard” in the Builder for rich formatting, or “Download .html” if paste fails.',
];

export const INSTALLATION_GUIDES: InstallationGuide[] = [
  {
    id: 'outlook-desktop',
    title: 'Install in Outlook (Desktop)',
    subtitle: 'Windows and Mac — Outlook 2016, 2019, 2021, and Microsoft 365',
    clientName: 'Microsoft Outlook (Desktop)',
    prerequisites: [
      ...sharedPrereq,
      'Microsoft Outlook installed and signed in with your work or personal account.',
    ],
    steps: [
      {
        title: 'Copy your signature from Signova',
        body: 'Open your signature in the Builder, click Copy HTML to Clipboard, then keep this window open until paste is complete.',
      },
      {
        title: 'Open Outlook signature settings',
        body: 'Windows: File → Options → Mail → Signatures. Mac: Outlook → Settings (or Preferences) → Signatures.',
      },
      {
        title: 'Create a new signature',
        body: 'Click New, name the signature (for example “Work — Signova”), and select it in the list.',
      },
      {
        title: 'Paste into the editor',
        body: 'Click inside the signature text box and press Ctrl+V (Windows) or Cmd+V (Mac). If formatting looks wrong, paste again or use Download .html from Signova and open that file in a browser, then copy from the browser preview.',
      },
      {
        title: 'Set default signatures',
        body: 'Under “Choose default signature”, assign your new signature to New messages and optionally Replies/forwards. Click OK to save.',
      },
      {
        title: 'Send a test email',
        body: 'Compose a new message to yourself and confirm the signature, links, and logo appear correctly.',
      },
    ],
    tips: [
      'Outlook may strip some CSS. If layout breaks, simplify colors in Signova or use a simpler template.',
      'For shared mailboxes, create the signature while signed into that mailbox profile.',
    ],
    troubleshooting: [
      {
        problem: 'Images do not appear',
        solution: 'Ensure logo and banner URLs in Signova are public HTTPS links. Outlook blocks local file paths.',
      },
      {
        problem: 'Signature is plain text only',
        solution: 'Copy again using Copy HTML from Signova, not plain text from another app.',
      },
    ],
  },
  {
    id: 'outlook-web',
    title: 'Install in Outlook on the Web',
    subtitle: 'Outlook.com and Microsoft 365 in the browser',
    clientName: 'Outlook on the Web',
    prerequisites: [
      ...sharedPrereq,
      'Access to Outlook in a browser (outlook.office.com or outlook.live.com).',
    ],
    steps: [
      {
        title: 'Copy your signature from Signova',
        body: 'In the Builder, use Copy HTML to Clipboard after saving your signature.',
      },
      {
        title: 'Open Outlook settings',
        body: 'Click the gear icon (Settings) → View all Outlook settings at the bottom of the panel.',
      },
      {
        title: 'Go to Mail → Compose and reply',
        body: 'In the settings search box, type “signature” or navigate to Mail → Compose and reply.',
      },
      {
        title: 'Enable and edit the signature',
        body: 'Turn on email signature if prompted. Paste into the signature editor with Ctrl+V or Cmd+V.',
      },
      {
        title: 'Choose when it appears',
        body: 'Enable options to include the signature on new messages and on replies/forwards if available, then click Save.',
      },
      {
        title: 'Verify in a new message',
        body: 'Click New mail and confirm the signature renders before sending to a colleague.',
      },
    ],
    tips: [
      'Outlook on the web and Outlook desktop use separate signature stores — install in each place you send mail from.',
    ],
    troubleshooting: [
      {
        problem: 'Paste removes formatting',
        solution: 'Copy from Signova again immediately before pasting. Avoid pasting through Notepad or other plain-text tools.',
      },
    ],
  },
  {
    id: 'gmail',
    title: 'Install in Gmail',
    subtitle: 'Google Workspace and personal Gmail',
    clientName: 'Gmail',
    prerequisites: [
      ...sharedPrereq,
      'Gmail account in a desktop browser (mobile Gmail has limited HTML support).',
    ],
    steps: [
      {
        title: 'Copy your signature from Signova',
        body: 'Use Copy HTML to Clipboard in the Builder. Gmail works best with rich HTML copied directly.',
      },
      {
        title: 'Open Gmail settings',
        body: 'Click the gear icon → See all settings → General tab → Signature section.',
      },
      {
        title: 'Create or select a signature',
        body: 'Click Create new (or edit an existing slot). Name it if Gmail prompts for a name.',
      },
      {
        title: 'Paste into the signature box',
        body: 'Click inside the editor and paste with Ctrl+V or Cmd+V. Scroll the preview to check layout.',
      },
      {
        title: 'Set defaults for send-as addresses',
        body: 'If you use multiple “From” addresses, set the signature for each address in the dropdown above the editor.',
      },
      {
        title: 'Save and test',
        body: 'Scroll to the bottom and click Save Changes. Compose a new message to verify links and images.',
      },
    ],
    tips: [
      'Gmail has a size limit for signatures; very large banners may be clipped — use compressed images at public URLs.',
      'Install separately in the Gmail app on phones; formatting may simplify on mobile.',
    ],
    troubleshooting: [
      {
        problem: 'Logo does not show',
        solution: 'Use a direct HTTPS image URL in Signova branding. Gmail blocks many redirect links.',
      },
    ],
  },
  {
    id: 'apple-mail',
    title: 'Install in Apple Mail',
    subtitle: 'macOS Mail app',
    clientName: 'Apple Mail',
    prerequisites: [
      ...sharedPrereq,
      'macOS with the Mail app configured for your account.',
    ],
    steps: [
      {
        title: 'Copy your signature from Signova',
        body: 'Copy HTML from the Builder. Alternatively download the .html file and open it in Safari to copy the rendered content.',
      },
      {
        title: 'Open Mail settings',
        body: 'Mail → Settings → Signatures tab (or Mail → Preferences → Signatures on older macOS).',
      },
      {
        title: 'Select your email account',
        body: 'Choose the account in the left column, then click the + button to add a signature.',
      },
      {
        title: 'Paste and adjust',
        body: 'Uncheck “Always match my default message font” if present, then paste into the signature pane. Drag handles to resize images if needed.',
      },
      {
        title: 'Assign as default',
        body: 'Drag your new signature to the account or specific mailbox so it applies to new messages.',
      },
      {
        title: 'Test from Mail',
        body: 'Create a new message and confirm formatting. Send yourself a test if images use remote URLs.',
      },
    ],
    tips: [
      'Apple Mail sometimes rewrites HTML on paste; if layout shifts, try copying from Safari after opening the downloaded .html file.',
    ],
    troubleshooting: [
      {
        problem: 'Signature reverts after restart',
        solution: 'Ensure you edited the signature under the correct account and did not leave a placeholder “Untitled” signature selected.',
      },
    ],
  },
  {
    id: 'mobile',
    title: 'Install on Mobile Email Apps',
    subtitle: 'iOS Mail, Outlook mobile, and Gmail app — limited HTML',
    clientName: 'Mobile email clients',
    prerequisites: [
      ...sharedPrereq,
      'Understanding that mobile clients often simplify HTML signatures.',
    ],
    steps: [
      {
        title: 'Prefer desktop setup first',
        body: 'Configure your signature on desktop Outlook or Gmail when possible; many mobile apps sync signatures from the server.',
      },
      {
        title: 'Outlook for iOS / Android',
        body: 'Open the app → your account avatar → Settings → Signature. Paste plain or simplified HTML. Complex tables may not render.',
      },
      {
        title: 'Gmail app',
        body: 'Menu → Settings → your account → Signature settings. Paste text; rich HTML support is limited compared to desktop Gmail.',
      },
      {
        title: 'Apple Mail on iPhone / iPad',
        body: 'Settings app → Mail → Signature → Per Account or All Accounts. Keep mobile signatures short (name, title, phone, one link).',
      },
      {
        title: 'Verify on device',
        body: 'Send a test message to yourself and open it on phone and desktop to compare rendering.',
      },
    ],
    tips: [
      'For NGOs standardizing on Outlook, installing on Outlook desktop or web first often propagates to mobile for Microsoft 365 accounts.',
    ],
  },
];

export const GUIDE_BY_ID: Record<GuideId, InstallationGuide> = Object.fromEntries(
  INSTALLATION_GUIDES.map((g) => [g.id, g]),
) as Record<GuideId, InstallationGuide>;

export function getGuide(id: string | undefined): InstallationGuide | undefined {
  if (!id) return undefined;
  return GUIDE_BY_ID[id as GuideId];
}
