import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTemplateById } from '@/features/signatures/templates';
import { exportSignatureToHtml, downloadSignatureAsHtml } from '@/features/signatures/utils/export';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Download, Edit, CheckCircle2 } from 'lucide-react';

const SharedSignature: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!token) { setError('Invalid share link'); return; }
    try {
      // Decode client-side (same base64url encoding used by backend)
      const json = atob(token.replace(/-/g, '+').replace(/_/g, '/'));
      setData(JSON.parse(json));
    } catch {
      // Fallback: try fetching from API (for server-side decode)
      fetch(`http://localhost:3000/api/v1/share/${token}`)
        .then((r) => r.json())
        .then(setData)
        .catch(() => setError('Invalid or expired share link'));
    }
  }, [token]);

  const handleCopy = async () => {
    if (!data) return;
    const html = exportSignatureToHtml(data);
    const blob = new Blob([html], { type: 'text/html' });
    await navigator.clipboard.write([new ClipboardItem({ 'text/html': blob })]);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleUseTemplate = () => {
    if (!data) return;
    // Encode data into query params for the builder
    const params = new URLSearchParams();
    Object.entries(data).forEach(([k, v]) => {
      if (v !== null && v !== undefined) {
        params.set(k, typeof v === 'object' ? JSON.stringify(v) : String(v));
      }
    });
    navigate(`/builder/new?prefill=${token}`);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Invalid Link</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-muted-foreground">Loading signature...</p>
      </div>
    );
  }

  const template = getTemplateById(data.templateId || 'standard');

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold">Email Signature</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Shared by {data.name} — use the buttons below to copy or customize
          </p>
        </div>

        {/* Preview */}
        <div className="bg-white p-10 shadow-xl rounded-lg border flex items-center justify-center min-h-[200px]">
          <template.component data={data} />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="blue" className="flex-1" onClick={handleCopy}>
            {copied ? (
              <><CheckCircle2 className="w-4 h-4 mr-2" /> Copied to clipboard!</>
            ) : (
              <><Copy className="w-4 h-4 mr-2" /> Copy for Gmail/Outlook</>
            )}
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => downloadSignatureAsHtml(data, `${data.name}-signature.html`)}>
            <Download className="w-4 h-4 mr-2" /> Download HTML
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleUseTemplate}>
            <Edit className="w-4 h-4 mr-2" /> Customize in Builder
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Powered by <span className="font-semibold">Signova</span> — free email signatures for NGOs
        </p>
      </div>
    </div>
  );
};

export default SharedSignature;
