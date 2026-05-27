import { useSearchParams } from 'react-router-dom';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

interface AppLayoutProps {
  children: (
    activeTab: string,
    setActiveTab: (tab: string) => void,
  ) => React.ReactNode;
  defaultTab?: string;
}

const AppLayout = ({ children, defaultTab = 'signatures' }: AppLayoutProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || defaultTab;

  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
  };

  return (
    <SidebarProvider
      defaultOpen
      className="flex min-h-svh w-full flex-row"
      style={{ '--sidebar-width': '16rem' } as React.CSSProperties}
    >
      <AppSidebar />
      <SidebarInset className="flex min-h-svh min-w-0 flex-1 flex-col overflow-hidden">
        {children(activeTab, setActiveTab)}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;
