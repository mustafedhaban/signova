import { ISignature } from '@signova/types';
import { getTemplateById } from '../templates';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type SignaturePreviewPaneProps = {
  signature: ISignature;
};

export function SignaturePreviewPane({ signature }: SignaturePreviewPaneProps) {
  const Template = getTemplateById(signature.templateId || 'standard');

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-muted/30 p-4 sm:p-6">
      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-base">Preview</CardTitle>
          <CardDescription>How this signature appears in email clients</CardDescription>
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
