import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import InstallationGuidesPanel from './InstallationGuidesPanel';
import type { ExportGuideTab } from '../content/modal-guides';

interface InstallationGuidesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: ExportGuideTab;
  onDownloadHtml?: () => void;
}

export function InstallationGuidesDialog({
  open,
  onOpenChange,
  defaultTab = 'gmail',
  onDownloadHtml,
}: InstallationGuidesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="gap-0 overflow-visible border-0 bg-transparent p-0 shadow-none sm:max-w-[480px]"
        showCloseButton={false}
      >
        <InstallationGuidesPanel
          mode="dialog"
          defaultTab={defaultTab}
          onClose={() => onOpenChange(false)}
          onDownloadHtml={onDownloadHtml}
        />
      </DialogContent>
    </Dialog>
  );
}

export default InstallationGuidesDialog;
