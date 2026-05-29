import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Copy, Save } from 'lucide-react';
import { exportSignatureToHtml } from '@/features/signatures/utils/export';
import { useBuilder } from '@/features/signatures/builder/BuilderContext';
import InstallationGuidesDialog from '@/features/guides/components/InstallationGuidesDialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

export function BuilderPreview() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const {
    isNew,
    currentTemplate,
    watchedData,
    saveSuccess,
    saveError,
    isSaving,
    handleSubmit,
    onSubmit,
    installGuideOpen,
    setInstallGuideOpen,
    handleDownloadHtml,
  } = useBuilder();

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(
      exportSignatureToHtml(watchedData as Parameters<typeof exportSignatureToHtml>[0]),
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <InstallationGuidesDialog
        open={installGuideOpen}
        onOpenChange={setInstallGuideOpen}
        onDownloadHtml={handleDownloadHtml}
      />
      <main className="relative flex min-h-0 min-w-0 flex-1 flex-col bg-muted/40 lg:min-h-full">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border/80 bg-background px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => navigate('/')}
              aria-label="Back to dashboard"
              className="shrink-0"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <div className="flex items-center gap-2">
              <span className="size-2 shrink-0 rounded-full bg-success" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Live editor
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {saveSuccess ? (
              <Badge variant="outline" className="gap-1 border-success/30 bg-success/10 text-success">
                <CheckCircle2 className="size-3.5" />
                Saved
              </Badge>
            ) : null}
            {saveError ? (
              <Alert variant="destructive" className="max-w-xs py-2">
                <AlertDescription className="text-xs">{saveError}</AlertDescription>
              </Alert>
            ) : null}
            <Button variant="outline" size="sm" onClick={handleCopyHtml} className="gap-2">
              {copied ? <CheckCircle2 className="size-4 text-success" /> : <Copy className="size-4" />}
              {copied ? 'Copied' : 'Copy HTML'}
            </Button>
            <Button onClick={handleSubmit(onSubmit)} disabled={isSaving} size="sm" className="gap-2">
              {isSaving ? <Spinner /> : <Save className="size-4" />}
              {isSaving ? 'Saving…' : 'Save signature'}
            </Button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto p-6 sm:p-10 lg:p-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,var(--primary)/0.06,transparent_55%)]" />

          <div className="relative z-10 w-full max-w-3xl">
            <p className="mb-4 text-center text-sm text-muted-foreground">
              {isNew ? 'Create a new signature' : 'Edit signature'}
            </p>

            <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-xl">
              <div className="space-y-3 border-b border-border/50 bg-muted/20 px-6 py-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="w-16 shrink-0 font-medium uppercase tracking-wide">To</span>
                  <Input
                    readOnly
                    value={watchedData.email || 'recipient@company.com'}
                    className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                  />
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="w-16 shrink-0 font-medium uppercase tracking-wide">Subject</span>
                  <Input
                    readOnly
                    value="Your email signature preview"
                    className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                  />
                </div>
              </div>

              <div className="min-h-[280px] bg-white p-8 sm:p-10">
                {currentTemplate ? (
                  <div className={cn('w-full transition-opacity duration-300')}>
                    <currentTemplate.component data={watchedData} />
                  </div>
                ) : (
                  <p className="py-12 text-center text-sm italic text-muted-foreground">
                    Select a template to begin
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
