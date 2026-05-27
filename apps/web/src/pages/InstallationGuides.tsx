import { useSearchParams } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import Navbar from '@/components/Navbar';
import InstallationGuidesPanel from '@/features/guides/components/InstallationGuidesPanel';
import type { ExportGuideTab } from '@/features/guides/content/modal-guides';

const TAB_PARAM = new Set<ExportGuideTab>(['gmail', 'outlook', 'apple-mail', 'html']);

function parseTab(value: string | null): ExportGuideTab {
  if (value && TAB_PARAM.has(value as ExportGuideTab)) {
    return value as ExportGuideTab;
  }
  return 'gmail';
}

const InstallationGuides: React.FC = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = parseTab(searchParams.get('tab'));

  return (
    <AppLayout defaultTab="guides">
      {() => (
        <>
          <Navbar title="Installation guides" description="Export signatures to your mail client" />
          <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto bg-muted/30 p-4 sm:p-8">
            <InstallationGuidesPanel key={defaultTab} defaultTab={defaultTab} />
          </div>
        </>
      )}
    </AppLayout>
  );
};

export default InstallationGuides;
