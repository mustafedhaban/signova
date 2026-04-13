import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, Building2, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';

const navItems = [
  { label: 'My Signatures', icon: LayoutDashboard, path: '/', tab: 'signatures' },
  { label: 'Team Management', icon: Users, path: '/?tab=teams', tab: 'teams' },
  { label: 'Organizations', icon: Building2, path: '/organizations', tab: 'organizations' },
  { label: 'Settings', icon: Settings, path: '/settings', tab: 'settings' },
];

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab = 'signatures', onTabChange }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (tab: string, path: string) => {
    onTabChange?.(tab);
    navigate(path.split('?')[0]);
  };

  return (
    <aside className="w-64 bg-card border-r shadow-sm flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-primary">Signova</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Email Signature Platform</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ label, icon: Icon, path, tab }) => {
          const isActive = ['settings', 'organizations'].includes(tab)
            ? location.pathname === path.split('?')[0]
            : activeTab === tab;

          return (
            <button
              key={tab}
              onClick={() => handleNav(tab, path)}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-md transition-colors text-sm ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-primary'
              }`}
            >
              <div className="flex items-center">
                <Icon className="w-4 h-4 mr-3" />
                <span>{label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t space-y-2">
        <div className="flex items-center space-x-3 px-3 py-2 text-sm text-muted-foreground bg-muted/50 rounded-md">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-7 h-7 rounded-full" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold shrink-0">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground text-xs">{user?.name}</p>
            <p className="truncate text-[11px]">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center px-3 py-2 space-x-2 text-muted-foreground rounded-md hover:bg-muted hover:text-destructive transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
