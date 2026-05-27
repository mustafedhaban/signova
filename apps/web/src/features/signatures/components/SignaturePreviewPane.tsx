import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ISignature } from '@signova/types';
import { CheckCircle2, Copy, Download, Edit, Plus, Share2, Trash2 } from 'lucide-react';
import { getTemplateById } from '../templates';
import { exportSignatureToHtml, downloadSignatureAsHtml } from '../utils/export';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

type SignaturePreviewPaneProps = {
  signature: ISignature;
  signatures: ISignature[];
  onDelete: (id: string, name?: string) => void;
};

export function SignaturePreviewPane({
  signature,
  signatures,
  onDelete,
}: SignaturePreviewPaneProps) {
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const Template = getTemplateById(signature.templateId || 'standard');

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
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-muted/30 p-4 sm:p-6">
      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader className="gap-4 space-y-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 space-y-1">
              <CardTitle className="text-base">Preview</CardTitle>
              <CardDescription>How this signature appears in email clients</CardDescription>
              {signatures.length > 1 ? (
                <Select
                  value={signature.id}
                  onValueChange={(id) => {
                    if (id) setSearchParams({ tab: 'signatures', signature: id });
                  }}
                >
                  <SelectTrigger className="mt-2 h-9 w-full max-w-xs">
                    <SelectValue placeholder="Select signature" />
                  </SelectTrigger>
                  <SelectContent>
                    {signatures.map((sig) => (
                      <SelectItem key={sig.id} value={sig.id}>
                        {sig.name || 'Untitled'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={() => navigate('/builder/new')}>
                <Plus className="size-4" />
                New
              </Button>
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
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-background p-6 sm:p-8">
            <div className="pointer-events-none select-none">
              {Template ? (
                <Template.component data={signature} />
              ) : (
                <span className="text-sm italic text-muted-foreground">Template not found</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
