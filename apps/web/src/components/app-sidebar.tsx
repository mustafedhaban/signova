import * as React from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Building2, Mail, Plus, Settings, Users } from 'lucide-react';
import { NavUser } from '@/components/nav-user';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useSignatures } from '@/features/signatures/hooks/useSignatures';

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
  if (pathname.startsWith('/builder')) {
    return NAV_MAIN.find((n) => n.id === 'signatures')!;
  }
  if (pathname.startsWith('/settings')) {
    return NAV_MAIN.find((n) => n.id === 'settings')!;
  }
  if (pathname.startsWith('/organizations')) {
    return NAV_MAIN.find((n) => n.id === 'organizations')!;
  }
  if (tab === 'teams') return NAV_MAIN.find((n) => n.id === 'teams')!;
  return NAV_MAIN.find((n) => n.id === 'signatures')!;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { signatures, isLoading } = useSignatures();
  const { isMobile, setOpenMobile } = useSidebar();
  const [search, setSearch] = React.useState('');

  const tab = searchParams.get('tab');
  const selectedId = searchParams.get('signature');
  const isBuilderRoute = location.pathname.startsWith('/builder');
  const activeNav = resolveActiveNav(location.pathname, tab);
  const showSignatures = activeNav.id === 'signatures' && location.pathname === '/';

  const filtered = signatures.filter((s) =>
    (s.name ?? '').toLowerCase().includes(search.toLowerCase()),
  );

  const closeMobile = () => {
    if (isMobile) setOpenMobile(false);
  };

  const selectNav = (item: NavItem) => {
    if (item.tab) {
      const next = new URLSearchParams();
      next.set('tab', item.tab);
      if (item.tab === 'signatures' && signatures[0]) {
        next.set('signature', signatures[0].id);
      }
      setSearchParams(next);
      if (location.pathname !== '/') navigate('/');
    } else {
      navigate(item.path);
    }
    closeMobile();
  };

  const selectSignature = (id: string) => {
    setSearchParams({ tab: 'signatures', signature: id });
    if (location.pathname !== '/') navigate('/');
    closeMobile();
  };

  return (
    <Sidebar collapsible={isBuilderRoute ? 'icon' : 'offcanvas'} {...props}>
      <SidebarHeader className="border-b border-sidebar-border px-2 py-3">
        <div className="flex items-center justify-between gap-2 px-0">
          <Link
            to="/"
            className="flex min-w-0 items-center gap-2.5 rounded-lg outline-none ring-sidebar-ring transition-colors hover:text-sidebar-accent-foreground focus-visible:ring-2"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Mail className="size-4" strokeWidth={2} />
            </span>
            <div className="min-w-0 text-left leading-tight group-data-[collapsible=icon]:hidden">
              <span className="block truncate font-heading text-sm font-semibold">Signova</span>
              <span className="block truncate text-[11px] text-muted-foreground">Signatures</span>
            </div>
          </Link>
          {showSignatures ? (
            <Button
              variant="outline"
              size="icon-sm"
              className="size-8 shrink-0 cursor-pointer group-data-[collapsible=icon]:hidden"
              onClick={() => navigate('/builder/new')}
              aria-label="New signature"
            >
              <Plus className="size-4" />
            </Button>
          ) : null}
        </div>
      </SidebarHeader>

      <SidebarContent className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <ScrollArea className="min-h-0 flex-1 *:data-[slot=scroll-area-viewport]:h-full">
          <SidebarGroup className="py-2">
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV_MAIN.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={activeNav.id === item.id}
                      onClick={() => selectNav(item)}
                      tooltip={item.title}
                      className="cursor-pointer"
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {showSignatures && signatures.length > 0 ? (
            <>
              <Separator className="mx-3 group-data-[collapsible=icon]:hidden" />
              <SidebarGroup className="py-2 group-data-[collapsible=icon]:hidden">
                <SidebarGroupLabel className="px-2 text-[11px] uppercase tracking-wider">
                  Yours
                </SidebarGroupLabel>
                {signatures.length > 4 ? (
                  <div className="px-2 pb-2">
                    <SidebarInput
                      placeholder="Filter…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="h-8"
                    />
                  </div>
                ) : null}
                <SidebarGroupContent>
                  {isLoading ? (
                    <p className="px-3 py-2 text-xs text-muted-foreground">Loading…</p>
                  ) : filtered.length === 0 ? (
                    <p className="px-3 py-2 text-xs text-muted-foreground">No matches</p>
                  ) : (
                    <SidebarMenu>
                      {filtered.map((sig) => (
                        <SidebarMenuItem key={sig.id}>
                          <SidebarMenuButton
                            isActive={selectedId === sig.id}
                            onClick={() => selectSignature(sig.id)}
                            tooltip={sig.name || 'Untitled'}
                            className="cursor-pointer"
                          >
                            <span className="truncate">{sig.name || 'Untitled'}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  )}
                </SidebarGroupContent>
              </SidebarGroup>
            </>
          ) : null}
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
