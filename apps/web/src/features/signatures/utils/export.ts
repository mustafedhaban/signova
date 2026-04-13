import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { getTemplateById } from '../templates';
import { ISignature } from '@signova/types';

export const exportSignatureToHtml = (signature: Partial<ISignature>) => {
  const template = getTemplateById(signature.templateId || 'standard');
  const TemplateComponent = template.component;
  const html = renderToStaticMarkup(React.createElement(TemplateComponent, { data: signature }));
  return `<div style="font-family: Arial, sans-serif;">${html}</div>`;
};

export const downloadSignatureAsHtml = (signature: Partial<ISignature>, filename = 'signature.html') => {
  const html = exportSignatureToHtml(signature);
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
