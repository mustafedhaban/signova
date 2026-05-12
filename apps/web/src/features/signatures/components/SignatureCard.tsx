import React, { useState } from 'react';
import { ISignature } from '@signova/types';
import { 
  Mail, 
  Trash2, 
  Edit, 
  Copy, 
  Share2, 
  MoreVertical, 
  CheckCircle2, 
  Download 
} from 'lucide-react';
import { exportSignatureToHtml, downloadSignatureAsHtml } from '../utils/export';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getTemplateById } from '../templates';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface SignatureCardProps {
  signature: ISignature;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const SignatureCard: React.FC<SignatureCardProps> = ({ signature, onDelete, onEdit }) => {
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
      const res = await fetch(`http://localhost:3000/api/v1/signatures/${signature.id}/share`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      await navigator.clipboard.writeText(data.url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 3000);
    } catch {
      // fallback: just show nothing
    }
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 bg-card border border-border/50 rounded-[2rem]">
      <CardHeader className="p-6 pb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <CardTitle className="truncate text-base font-bold tracking-tight">{signature.name || 'Untitled Signature'}</CardTitle>
              <CardDescription className="truncate text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                Template: {signature.templateId || 'Standard'}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(signature.id)}
              className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <Edit className="w-4 h-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl border-2 shadow-xl">
                <DropdownMenuItem onClick={handleShare} className="rounded-lg cursor-pointer">
                  <Share2 className="w-4 h-4 mr-2" />
                  <span>{shareCopied ? 'Copied Link!' : 'Copy Share Link'}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onDelete(signature.id)} 
                  className="rounded-lg cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        <div className="relative rounded-2xl border bg-muted/20 p-4 h-[140px] overflow-hidden group-hover:bg-muted/30 transition-colors duration-500">
          <div className="scale-[0.6] origin-top-left w-[166%] pointer-events-none select-none">
            {Template ? <Template.component data={signature} /> : <div className="text-muted-foreground italic">Template not found</div>}
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-muted/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <Button
            onClick={handleCopy}
            className={cn(
              "w-full h-11 rounded-xl font-bold transition-all duration-300 active:scale-[0.98] border-2 shadow-sm",
              copied 
                ? "bg-green-500 text-white border-green-500 hover:bg-green-600 shadow-green-500/20" 
                : "bg-background text-foreground border-border hover:bg-muted hover:border-border"
            )}
          >
            {copied ? (
              <><CheckCircle2 className="w-4 h-4 mr-2" /> Copied</>
            ) : (
              <><Copy className="w-4 h-4 mr-2" /> Copy HTML</>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => downloadSignatureAsHtml(signature, `${signature.name || 'signature'}.html`)}
            className="w-full h-11 rounded-xl font-bold border-2 border-border/50 hover:bg-muted active:scale-[0.98] shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignatureCard;
