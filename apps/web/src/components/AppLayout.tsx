import React, { useState } from 'react';
import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: (
    activeTab: string,
    setActiveTab: (tab: string) => void,
    openSidebar: () => void,
  ) => React.ReactNode;
  defaultTab?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, defaultTab = 'signatures' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => setSidebarOpen(true);

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-background">
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 shrink-0 transform bg-card transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:shadow-none'}
      `}
      >
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setSidebarOpen(false);
          }}
        />
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-md animate-in-fade lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      <main className="relative flex min-h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden">
          {children(activeTab, setActiveTab, openSidebar)}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
