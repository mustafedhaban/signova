import { useState } from 'react';
import { ISignature } from '@signova/types';
import {
  Mail,
  Trash2,
  Edit,
  Copy,
  Share2,
  MoreVertical,
  CheckCircle2,
  Download,
} from 'lucide-react';
import { exportSignatureToHtml, downloadSignatureAsHtml } from '../utils/export';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getTemplateById } from '../templates';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { API_BASE } from '@/lib/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface SignatureCardProps {
  signature: ISignature;
  onDelete: (id: string, name?: string) => void;
  onEdit: (id: string) => void;
}

const SignatureCard = ({ signature, onDelete, onEdit }: SignatureCardProps) => {
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const Template = getTemplateById(signature.templateId || 'standard');

  const handleCopy = () => {
    const html = exportSignatureToHtml(signature);
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      const { data } = await axios.get<{ url: string }>(
        `${API_BASE}/signatures/${signature.id}/share`,
      );
      await navigator.clipboard.writeText(data.url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 3000);
    } catch {
      // ignore
    }
  };

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Mail className="size-4" />
          </span>
          <div className="min-w-0">
            <CardTitle className="truncate text-sm">{signature.name || 'Untitled signature'}</CardTitle>
            <CardDescription className="truncate">
              <Badge variant="outline" className="mt-1 font-normal">
                {signature.templateId || 'standard'}
              </Badge>
            </CardDescription>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-0.5 opacity-100 lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit(signature.id)}
            aria-label="Edit signature"
          >
            <Edit className="size-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon-sm" aria-label="More actions" />}
            >
              <MoreVertical className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="size-4" />
                {shareCopied ? 'Link copied' : 'Copy share link'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => onDelete(signature.id, signature.name)}>
                <Trash2 className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="relative h-[120px] overflow-hidden rounded-md border bg-muted/30 p-3">
          <div className="pointer-events-none w-[166%] origin-top-left scale-[0.55] select-none">
            {Template ? (
              <Template.component data={signature} />
            ) : (
              <span className="text-xs text-muted-foreground italic">Template not found</span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="grid grid-cols-2 gap-2 border-t bg-muted/20 pt-3">
        <Button
          variant={copied ? 'default' : 'outline'}
          size="sm"
          onClick={handleCopy}
          className={cn(copied && 'bg-success text-success-foreground hover:bg-success/90')}
        >
          {copied ? (
            <>
              <CheckCircle2 className="size-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="size-4" />
              Copy HTML
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => downloadSignatureAsHtml(signature, `${signature.name || 'signature'}.html`)}
        >
          <Download className="size-4" />
          Export
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SignatureCard;
