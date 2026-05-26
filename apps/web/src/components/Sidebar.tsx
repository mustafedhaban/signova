import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, Building2, LogOut } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

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
    <aside className="w-full h-full bg-card border-r flex flex-col shrink-0 relative z-10">
      {/* Logo */}
      <div className="p-8 pb-10">
        <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-11 h-11 bg-primary rounded-[14px] flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform duration-300 ease-spring">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">Signova</h1>
            <p className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground/50">Pro Signature Hub</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 px-4">
        <nav className="space-y-1">
          {navItems.map(({ label, icon: Icon, path, tab }) => {
            const isActive = ['settings', 'organizations'].includes(tab)
              ? location.pathname === path.split('?')[0]
              : activeTab === tab;

            return (
              <Button
                key={tab}
                variant="ghost"
                onClick={() => handleNav(tab, path)}
                className={cn(
                  "w-full justify-start px-4 py-6 rounded-2xl transition-all duration-300 text-sm group relative overflow-hidden",
                  isActive
                    ? 'bg-primary/5 text-primary font-bold shadow-sm'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                )}
              >
                <div className="flex items-center relative z-10">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-300",
                    isActive ? 'bg-primary/10' : 'group-hover:bg-muted'
                  )}>
                    <Icon className={cn("h-[18px] w-[18px] transition-colors", isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground')} />
                  </div>
                  <span className="tracking-tight">{label}</span>
                </div>
                
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                )}
              </Button>
            );
          })}
        </nav>
      </ScrollArea>

      {/* User + Logout */}
      <div className="p-6 mt-auto">
        <div className="p-4 bg-muted/30 rounded-[24px] border border-border/50 group transition-all hover:bg-muted/50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="relative">
              <Avatar className="w-10 h-10 rounded-xl border-2 border-background shadow-md">
                <AvatarImage src={user?.avatarUrl} alt={user?.name} className="object-cover" />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-black">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success border-2 border-background rounded-full" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-black text-foreground text-[11px] leading-none mb-1 uppercase tracking-wider">{user?.name}</p>
              <p className="truncate text-[10px] text-muted-foreground font-medium">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 text-muted-foreground rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all duration-300 text-[11px] font-bold uppercase tracking-widest h-10"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;


