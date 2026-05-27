import * as React from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Building2, Mail, Settings, ShieldCheck, Users } from 'lucide-react';
import { NavUser } from '@/components/nav-user';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';

type NavItem = {
  id: string;
  title: string;
  icon: React.ReactNode;
  path: string;
  tab?: string;
};

const NAV_MAIN: NavItem[] = [
  { id: 'signatures', title: 'Signatures', icon: <Mail className="size-4" />, path: '/', tab: 'signatures' },
  { id: 'teams', title: 'Teams', icon: <Users className="size-4" />, path: '/', tab: 'teams' },
  { id: 'organizations', title: 'Organizations', icon: <Building2 className="size-4" />, path: '/organizations' },
  { id: 'settings', title: 'Settings', icon: <Settings className="size-4" />, path: '/settings' },
];

function resolveActiveNav(pathname: string, tab: string | null): NavItem {
  if (pathname.startsWith('/organizations')) return NAV_MAIN.find((n) => n.id === 'organizations')!;
  if (pathname.startsWith('/settings')) return NAV_MAIN.find((n) => n.id === 'settings')!;
  if (tab === 'teams') return NAV_MAIN.find((n) => n.id === 'teams')!;
  return NAV_MAIN.find((n) => n.id === 'signatures')!;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isMobile, setOpenMobile } = useSidebar();

  const closeMobileSidebar = () => {
    if (isMobile) setOpenMobile(false);
  };

  const tab = searchParams.get('tab');
  const activeNav = resolveActiveNav(location.pathname, tab);

  const selectNav = (item: NavItem) => {
    if (item.tab) {
      const next = new URLSearchParams();
      next.set('tab', item.tab);
      setSearchParams(next);
      if (location.pathname !== '/') navigate('/');
      closeMobileSidebar();
    } else {
      navigate(item.path);
      closeMobileSidebar();
    }
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link to="/" />}>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <ShieldCheck className="size-4" />
              </span>
              <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Signova</span>
                <span className="truncate text-xs text-muted-foreground">Email signatures</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <ScrollArea className="flex-1 [&>[data-slot=scroll-area-viewport]]:h-full">
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV_MAIN.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={activeNav.id === item.id}
                      onClick={() => selectNav(item)}
                      tooltip={item.title}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="mt-auto border-t border-sidebar-border">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
