import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ISignature } from '@signova/types';
import { CheckCircle2, Copy, Download, Edit, Share2, Trash2 } from 'lucide-react';
import { exportSignatureToHtml, downloadSignatureAsHtml } from '../utils/export';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type SignatureToolbarProps = {
  signature: ISignature;
  onDelete: (id: string, name?: string) => void;
};

export function SignatureToolbar({ signature, onDelete }: SignatureToolbarProps) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(exportSignatureToHtml(signature));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/signatures/${signature.id}/share`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      await navigator.clipboard.writeText(data.url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 3000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-col gap-3 border-b bg-background px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="truncate text-lg font-semibold">{signature.name || 'Untitled signature'}</h2>
          <Badge variant="outline" className="font-normal">
            {signature.templateId || 'standard'}
          </Badge>
        </div>
        <p className="truncate text-sm text-muted-foreground">{signature.email}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => navigate(`/builder/${signature.id}`)}>
          <Edit className="size-4" />
          Edit
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="size-4" />
          {shareCopied ? 'Copied' : 'Share'}
        </Button>
        <Button
          variant={copied ? 'default' : 'outline'}
          size="sm"
          onClick={handleCopy}
          className={cn(copied && 'bg-success text-success-foreground hover:bg-success/90')}
        >
          {copied ? <CheckCircle2 className="size-4" /> : <Copy className="size-4" />}
          {copied ? 'Copied' : 'Copy HTML'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            downloadSignatureAsHtml(signature, `${signature.name || 'signature'}.html`)
          }
        >
          <Download className="size-4" />
          Download
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onDelete(signature.id, signature.name)}
        >
          <Trash2 className="size-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}
