import { BuilderProvider } from '@/features/signatures/builder/BuilderContext';
import { BuilderContentPanel } from '@/features/signatures/builder/BuilderContentPanel';
import { BuilderNavRail } from '@/features/signatures/builder/BuilderNavRail';
import { BuilderPreview } from '@/features/signatures/builder/BuilderPreview';
import { BuilderSidebarEffect } from '@/features/signatures/builder/BuilderSidebarEffect';
import AppLayout from '@/components/AppLayout';

const Builder = () => {
  return (
    <BuilderProvider>
      <AppLayout defaultTab="signatures">
        {() => (
          <>
            <BuilderSidebarEffect />
            <div className="flex h-full min-h-0 flex-col overflow-hidden lg:flex-row">
              <BuilderNavRail />
              <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden lg:flex-row">
                <BuilderContentPanel />
                <BuilderPreview />
              </div>
            </div>
          </>
        )}
      </AppLayout>
    </BuilderProvider>
  );
};

export default Builder;
