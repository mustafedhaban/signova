import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from '@/lib/toast';
import { ISignature } from '@signova/types';
import {
  CheckCircle2,
  Copy,
  Download,
  Edit,
  Mail,
  MoreHorizontal,
  Share2,
  Trash2,
} from 'lucide-react';
import InstallationGuidesDialog from '@/features/guides/components/InstallationGuidesDialog';
import { getTemplateById } from '../templates';
import { exportSignatureToHtml, downloadSignatureAsHtml } from '../utils/export';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { API_BASE } from '@/lib/api';

type SignaturePreviewPaneProps = {
  signature: ISignature;
  signatures: ISignature[];
  onDelete: (id: string, name?: string) => void;
};

const actionBtn =
  'cursor-pointer transition-[background-color,border-color,color,transform] duration-200 ease-[var(--ease-out)] active:scale-[0.98]';

export function SignaturePreviewPane({
  signature,
  onDelete,
}: SignaturePreviewPaneProps) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [guidesOpen, setGuidesOpen] = useState(false);
  const Template = getTemplateById(signature.templateId || 'standard');
  const templateLabel = (signature.templateId || 'standard').replace(/-/g, ' ');

  const handleCopy = () => {
    navigator.clipboard.writeText(exportSignatureToHtml(signature));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      const { data } = await axios.get<{ url: string }>(`${API_BASE}/signatures/${signature.id}/share`);
      await navigator.clipboard.writeText(data.url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 3000);
    } catch {
      toast.error('Could not copy share link. Please try again.');
    }
  };

  return (
    <>
      <InstallationGuidesDialog
        open={guidesOpen}
        onOpenChange={setGuidesOpen}
        onDownloadHtml={() =>
          downloadSignatureAsHtml(signature, `${signature.name || 'signature'}.html`)
        }
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div className="border-b border-border/80 bg-background px-4 py-3 sm:px-8">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3">
          <Badge variant="secondary" className="font-normal capitalize">
            {templateLabel}
          </Badge>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <Button
              size="sm"
              className={actionBtn}
              onClick={() => navigate(`/builder/${signature.id}`)}
            >
              <Edit className="size-4" />
              <span className="sr-only sm:not-sr-only sm:ml-0">Edit</span>
            </Button>
            <Button
              variant={copied ? 'default' : 'outline'}
              size="sm"
              onClick={handleCopy}
              className={cn(
                actionBtn,
                'hidden sm:inline-flex',
                copied && 'bg-success text-success-foreground hover:bg-success/90',
              )}
            >
              {copied ? <CheckCircle2 className="size-4" /> : <Copy className="size-4" />}
              {copied ? 'Copied' : 'Copy HTML'}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="outline" size="sm" className={actionBtn} />}
              >
                <MoreHorizontal className="size-4" />
                <span className="sr-only">More</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-44">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={handleCopy} className="cursor-pointer sm:hidden">
                    {copied ? <CheckCircle2 className="size-4" /> : <Copy className="size-4" />}
                    {copied ? 'Copied' : 'Copy HTML'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShare} className="cursor-pointer">
                    <Share2 className="size-4" />
                    {shareCopied ? 'Link copied' : 'Share link'}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() =>
                      downloadSignatureAsHtml(signature, `${signature.name || 'signature'}.html`)
                    }
                  >
                    <Download className="size-4" />
                    Download
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={() => onDelete(signature.id, signature.name)}
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center px-4 py-8 sm:px-8 sm:py-10">
        <div className="w-full max-w-4xl overflow-hidden rounded-xl border border-border bg-card shadow-soft">
          <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
            <span className="size-2 rounded-full bg-red-400/90" aria-hidden />
            <span className="size-2 rounded-full bg-amber-400/90" aria-hidden />
            <span className="size-2 rounded-full bg-emerald-400/90" aria-hidden />
            <span className="ml-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Inbox preview
            </span>
          </div>
          <div className="bg-white p-8 sm:p-12">
            <div className="pointer-events-none select-none">
              {Template ? (
                <Template.component data={signature} />
              ) : (
                <p className="text-sm text-muted-foreground">Template not found.</p>
              )}
            </div>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Paste copied HTML into your email client signature settings.
        </p>

        <div className="mt-8 w-full max-w-4xl rounded-xl border border-border bg-card p-5 shadow-soft sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-[oklch(0.488_0.127_237.322)]">
                <Mail className="size-5" strokeWidth={1.75} aria-hidden />
              </span>
              <div>
                <h3 className="font-heading text-sm font-semibold tracking-tight">
                  Install your signature
                </h3>
                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                  Step-by-step guides for Gmail, Outlook, and Apple Mail.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:shrink-0">
              <Button size="sm" className={actionBtn} onClick={() => setGuidesOpen(true)}>
                View guides
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={actionBtn}
                onClick={() => navigate('/guides')}
              >
                Open full page
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
