import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

interface AppLayoutProps {
  children: (activeTab: string, setActiveTab: (tab: string) => void) => React.ReactNode;
  defaultTab?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, defaultTab = 'signatures' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Sidebar - Desktop always visible, Mobile toggleable */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform bg-card transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:shadow-none'}
      `}>
        <Sidebar activeTab={activeTab} onTabChange={(tab) => {
          setActiveTab(tab);
          setSidebarOpen(false);
        }} />
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-md lg:hidden transition-opacity duration-500 animate-in-fade"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Mobile header trigger */}
        <div className="lg:hidden absolute top-4 left-4 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 bg-card border rounded-md shadow-sm hover:bg-muted"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {children(activeTab, setActiveTab)}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
