import React, { useState } from 'react';
import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: (activeTab: string, setActiveTab: (tab: string) => void) => React.ReactNode;
  defaultTab?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, defaultTab = 'signatures' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children(activeTab, setActiveTab)}
      </main>
    </div>
  );
};

export default AppLayout;
