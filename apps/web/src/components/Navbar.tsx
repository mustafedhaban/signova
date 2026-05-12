import React from 'react';
import { PlusCircle, User, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  title: string;
  showNewButton?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ title, showNewButton = false }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <header className="h-20 px-8 bg-background/60 backdrop-blur-xl border-b border-border/50 sticky top-0 z-40 flex items-center justify-between shrink-0">
      <div className="flex items-center space-x-6">
        {/* Spacer for mobile menu button in AppLayout */}
        <div className="w-10 lg:hidden" />
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-foreground tracking-tight">{title}</h2>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/50">Workspace Dashboard</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-5">
        {showNewButton && (
          <Button
            onClick={() => navigate('/builder/new')}
            className="group px-6 space-x-2 text-white bg-primary rounded-[14px] hover:bg-primary/90 transition-all duration-300 shadow-xl shadow-primary/25 active:scale-95 text-sm font-bold h-11"
          >
            <PlusCircle className="w-4.5 h-4.5 transition-transform group-hover:rotate-90 duration-500" />
            <span>New Signature</span>
          </Button>
        )}

        <div className="w-px h-6 bg-border mx-1" />

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-11 w-11 rounded-xl p-0 hover:bg-transparent group">
              <div className="relative">
                <Avatar className="h-10 w-10 rounded-xl border-2 border-background shadow-md group-hover:border-primary/20 transition-all duration-300">
                  <AvatarImage src={user?.avatarUrl} alt={user?.name} className="object-cover" />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-black">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 mt-2 p-2 rounded-2xl border-2 shadow-2xl" align="end">
            <DropdownMenuLabel className="font-normal p-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 rounded-xl border-2 shadow-sm">
                  <AvatarImage src={user?.avatarUrl} alt={user?.name} className="object-cover" />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-black">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <p className="text-sm font-black leading-none truncate uppercase tracking-wider">{user?.name}</p>
                  <p className="text-[10px] leading-none text-muted-foreground mt-1.5 truncate font-medium">{user?.email}</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="mx-2" />
            <div className="p-1">
              <DropdownMenuItem onClick={() => navigate('/settings')} className="rounded-xl cursor-pointer py-2.5 px-3">
                <User className="mr-2.5 h-4 w-4 text-muted-foreground" />
                <span className="font-bold text-xs uppercase tracking-widest">Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')} className="rounded-xl cursor-pointer py-2.5 px-3">
                <Settings className="mr-2.5 h-4 w-4 text-muted-foreground" />
                <span className="font-bold text-xs uppercase tracking-widest">Settings</span>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator className="mx-2" />
            <div className="p-1">
              <DropdownMenuItem onClick={logout} className="rounded-xl cursor-pointer py-2.5 px-3 text-destructive focus:text-destructive focus:bg-destructive/10">
                <LogOut className="mr-2.5 h-4 w-4" />
                <span className="font-bold text-xs uppercase tracking-widest">Log out</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;

