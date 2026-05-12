import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTemplateById } from '@/features/signatures/templates';
import { exportSignatureToHtml, downloadSignatureAsHtml } from '@/features/signatures/utils/export';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Download, Edit, CheckCircle2, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

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
      <div className="flex items-center justify-center min-h-screen bg-muted/30 p-4">
        <Card className="w-full max-w-md border-2 shadow-soft rounded-[2rem] overflow-hidden animate-in zoom-in-95 duration-300">
          <CardHeader className="text-center bg-destructive/5 pb-8">
            <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-6 h-6 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold text-destructive">Invalid Link</CardTitle>
            <CardDescription className="font-medium">{error}</CardDescription>
          </CardHeader>
          <CardContent className="pt-8 text-center">
            <Button variant="outline" onClick={() => navigate('/')} className="rounded-xl font-bold border-2">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-muted/30 p-4">
        <div className="animate-pulse space-y-4 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-3xl mx-auto" />
          <p className="text-sm font-bold text-primary/60 uppercase tracking-widest">Loading signature...</p>
        </div>
      </div>
    );
  }

  const template = getTemplateById(data.templateId || 'standard');

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-6 lg:p-12">
      <div className="w-full max-w-3xl space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-2xl mb-2 rotate-3 shadow-soft border-2 border-primary/5">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-primary">Signature Ready</h1>
          <p className="text-muted-foreground font-medium max-w-md mx-auto">
            Shared by <span className="text-primary font-bold">{data.name}</span>. Copy it to your email client or customize your own.
          </p>
        </div>

        {/* Preview Container */}
        <div className="bg-card/40 backdrop-blur-sm border-2 border-dashed border-border rounded-[2.5rem] p-6 lg:p-12 shadow-glass group">
           <div className="flex items-center justify-between mb-8 px-4">
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-sm" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-sm" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-sm" />
              </div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30">Live Signature Preview</div>
           </div>
           <div className="bg-white p-10 lg:p-16 shadow-soft rounded-[2rem] border min-h-[300px] flex items-center justify-center transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/5">
            <template.component data={data} />
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button 
            className={cn(
              "h-14 rounded-2xl font-bold text-base shadow-xl transition-all active:scale-95 sm:col-span-1",
              copied ? "bg-green-500 hover:bg-green-600 shadow-green-500/20" : "shadow-primary/20"
            )}
            onClick={handleCopy}
          >
            {copied ? (
              <><CheckCircle2 className="w-5 h-5 mr-2" /> Copied!</>
            ) : (
              <><Copy className="w-5 h-5 mr-2" /> Copy HTML</>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            className="h-14 rounded-2xl font-bold text-base border-2 bg-background hover:bg-muted active:scale-95" 
            onClick={() => downloadSignatureAsHtml(data, `${data.name}-signature.html`)}
          >
            <Download className="w-5 h-5 mr-2" /> Download
          </Button>

          <Button 
            variant="outline" 
            className="h-14 rounded-2xl font-bold text-base border-2 bg-background hover:bg-muted active:scale-95" 
            onClick={handleUseTemplate}
          >
            <Edit className="w-5 h-5 mr-2" /> Customize
          </Button>
        </div>

        <div className="pt-8 text-center space-y-4">
          <div className="inline-flex items-center px-4 py-1.5 bg-primary/5 rounded-full border border-primary/10">
            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.25em]">
              Powered by Signova Engine
            </p>
          </div>
          <p className="text-[11px] font-medium text-muted-foreground/40 max-w-sm mx-auto leading-relaxed">
            Create professional, mobile-responsive email signatures for your entire team in minutes. 
            <Link to="/register" className="text-primary hover:underline ml-1">Get started free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SharedSignature;
