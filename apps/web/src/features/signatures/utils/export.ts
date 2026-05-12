import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { getTemplateById } from '../templates';
import { ISignature } from '@signova/types';

export const exportSignatureToHtml = (data: ISignature): string => {
  const Template = getTemplateById(data.templateId)?.component;
  if (!Template) return '';

  const html = renderToStaticMarkup(React.createElement(Template, { data }));

  return `
<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <!--[if !mso]><!-->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <!--<![endif]-->
  <style>
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }
    @media (prefers-color-scheme: dark) {
      .dark-mode-bg { background-color: #0f172a !important; }
      .dark-mode-text { color: #f8fafc !important; }
      .dark-mode-border { border-color: #1e293b !important; }
    }
    /* Mobile-first overrides */
    @media only screen and (max-width: 480px) {
      .mobile-width { width: 100% !important; min-width: 100% !important; }
      .mobile-stack { display: block !important; width: 100% !important; padding-right: 0 !important; padding-left: 0 !important; border-right: none !important; border-bottom: 2px solid #f1f5f9 !important; padding-bottom: 20px !important; margin-bottom: 20px !important; }
      .mobile-padding { padding: 20px !important; }
      .mobile-center { text-align: center !important; margin: 0 auto !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: transparent;">
  <div style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    ${html}
  </div>
</body>
</html>
  `.trim();
};

export const downloadSignatureAsHtml = (signature: Partial<ISignature>, filename = 'signature.html') => {
  const html = exportSignatureToHtml(signature as ISignature);
  const full = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Email Signature</title></head>
<body>${html}</body>
</html>`;
  const blob = new Blob([full], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
