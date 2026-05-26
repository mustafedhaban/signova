import React from 'react';
import { PlusCircle, User, LogOut, Settings, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  title: string;
  showNewButton?: boolean;
  onMenuClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ title, showNewButton = false, onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-20 shrink-0 items-center justify-between border-b border-border/50 bg-background/60 px-4 backdrop-blur-xl sm:px-8">
      <div className="flex min-w-0 items-center gap-3 sm:gap-6">
        {onMenuClick && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onMenuClick}
            className="h-10 w-10 shrink-0 rounded-xl lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div className="min-w-0 flex flex-col">
          <h2 className="truncate text-lg font-bold tracking-tight text-foreground sm:text-xl">{title}</h2>
          <div className="flex items-center space-x-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-[11px] font-black uppercase tracking-[0.15em] text-muted-foreground/50">
              Workspace Dashboard
            </span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-5">
        {showNewButton && (
          <Button
            onClick={() => navigate('/builder/new')}
            className="group h-11 space-x-2 rounded-[14px] bg-primary px-4 text-sm font-bold text-primary-foreground shadow-xl shadow-primary/25 transition-all active:scale-95 hover:bg-primary/90 sm:px-6"
          >
            <PlusCircle className="h-[18px] w-[18px] transition-transform group-hover:rotate-90 motion-safe:duration-500" />
            <span className="hidden sm:inline">New Signature</span>
            <span className="sm:hidden">New</span>
          </Button>
        )}

        <div className="mx-1 hidden h-6 w-px bg-border sm:block" />

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="group relative h-11 w-11 rounded-xl p-0 hover:bg-transparent">
              <div className="relative">
                <Avatar className="h-10 w-10 rounded-xl border-2 border-background shadow-md transition-all group-hover:border-primary/20">
                  <AvatarImage src={user?.avatarUrl} alt={user?.name} className="object-cover" />
                  <AvatarFallback className="bg-primary/10 text-xs font-black text-primary">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-background bg-success" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mt-2 w-64 rounded-2xl border-2 p-2 shadow-2xl" align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-4 font-normal">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10 rounded-xl border-2 shadow-sm">
                    <AvatarImage src={user?.avatarUrl} alt={user?.name} className="object-cover" />
                    <AvatarFallback className="bg-primary/10 text-xs font-black text-primary">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex flex-col">
                    <p className="truncate text-sm font-black uppercase leading-none tracking-wider">
                      {user?.name}
                    </p>
                    <p className="mt-1.5 truncate text-[10px] font-medium leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="mx-2" />
            <DropdownMenuGroup className="p-1">
              <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer rounded-xl px-3 py-2.5">
                <User className="mr-2.5 h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-bold uppercase tracking-widest">Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer rounded-xl px-3 py-2.5">
                <Settings className="mr-2.5 h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-bold uppercase tracking-widest">Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="mx-2" />
            <DropdownMenuGroup className="p-1">
              <DropdownMenuItem
                onClick={logout}
                className="cursor-pointer rounded-xl px-3 py-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <LogOut className="mr-2.5 h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
