import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  EXPORT_MODAL_GUIDES,
  type ExportGuideTab,
} from '../content/modal-guides';
import { copyHtmlToClipboard } from '@/features/signatures/utils/signature-clipboard';
import { toast } from '@/lib/toast';
import { Copy, Check, Mail, Monitor, Laptop, Code2, Printer, Download } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import '@/features/guides/guide-print.css';

const TAB_ICONS: Record<ExportGuideTab, React.ComponentType<{ className?: string }>> = {
  gmail: Mail,
  outlook: Monitor,
  'apple-mail': Laptop,
  html: Code2,
};

interface InstallationGuidesPanelProps {
  defaultTab?: ExportGuideTab;
  className?: string;
  /** Page at /guides or dialog after Save Changes */
  mode?: 'page' | 'dialog';
  onClose?: () => void;
  onDownloadHtml?: () => void;
}

export function InstallationGuidesPanel({
  defaultTab = 'gmail',
  className,
  mode = 'page',
  onClose,
  onDownloadHtml,
}: InstallationGuidesPanelProps) {
  const [, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<ExportGuideTab>(defaultTab);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState('');

  const selectTab = (tab: ExportGuideTab) => {
    setActiveTab(tab);
    if (mode === 'page') {
      setSearchParams({ tab }, { replace: true });
    }
  };

  const guide = EXPORT_MODAL_GUIDES.find((g) => g.id === activeTab)!;

  const handleCopy = async () => {
    setCopyError('');
    const ok = await copyHtmlToClipboard();
    if (ok) {
      setCopied(true);
      toast.success('Signature copied to clipboard');
      setTimeout(() => setCopied(false), 2500);
    } else {
      const msg = 'Could not copy signature. Save your changes again and retry.';
      setCopyError(msg);
      toast.error(msg);
    }
  };

  const handlePrint = () => {
    document.title = `Signova — ${guide.title}`;
    window.print();
  };

  return (
    <div
      className={cn(
        'guide-print-root mx-auto w-full max-w-[480px] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl',
        className,
      )}
    >
      <header className="guide-print-header border-b border-border px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">Export Signature</h1>
            <p className="no-print mt-1 text-sm text-muted-foreground">
              {mode === 'dialog'
                ? 'Your signature was saved. Install it in your email client below.'
                : 'Install your signature in your email client'}
            </p>
          </div>
          {mode === 'dialog' && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="no-print rounded-lg px-2 py-1 text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Close"
            >
              ✕
            </button>
          )}
        </div>
      </header>

      <div className="no-print px-4 pt-4">
        <div
          className="grid grid-cols-4 gap-1 rounded-xl bg-muted/60 p-1"
          role="tablist"
          aria-label="Email client"
        >
          {EXPORT_MODAL_GUIDES.map((tab) => {
            const Icon = TAB_ICONS[tab.id];
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => selectTab(tab.id)}
                className={cn(
                  'flex flex-col items-center justify-center gap-1.5 rounded-lg px-1 py-2.5 text-[11px] font-semibold transition-all',
                  isActive
                    ? 'border border-border bg-card text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon
                  className={cn('h-5 w-5', isActive ? 'text-primary' : 'text-muted-foreground')}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-6 py-5" role="tabpanel">
        <h2 className="mb-4 text-base font-bold text-foreground">{guide.title}</h2>
        <ol className="space-y-3">
          {guide.steps.map((step, index) => (
            <li key={step} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
              <span
                className="guide-step-number flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary"
                aria-hidden
              >
                {index + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="no-print border-t border-border bg-muted/20 px-6 py-5 space-y-3">
        {copyError && (
          <p className="text-center text-xs font-medium text-destructive">{copyError}</p>
        )}
        <Button
          type="button"
          onClick={handleCopy}
          className="h-12 w-full rounded-xl text-base font-bold shadow-lg shadow-primary/25"
        >
          {copied ? (
            <>
              <Check className="mr-2 h-5 w-5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-5 w-5" />
              Copy Signature
            </>
          )}
        </Button>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handlePrint}
              className="h-9 rounded-lg px-2 font-bold text-muted-foreground"
            >
              <Printer className="mr-1.5 h-3.5 w-3.5" />
              Save as PDF
            </Button>
            {activeTab === 'html' && onDownloadHtml && (
              <Button
                type="button"
                variant="ghost"
                onClick={onDownloadHtml}
                className="h-9 rounded-lg px-2 font-bold text-muted-foreground"
              >
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Download .html
              </Button>
            )}
          </div>
          {mode === 'dialog' ? (
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="h-9 rounded-lg px-2 font-bold text-primary"
            >
              Done
            </Button>
          ) : (
            <Link to="/" className="font-bold text-primary underline-offset-2 hover:underline">
              Back to dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default InstallationGuidesPanel;
