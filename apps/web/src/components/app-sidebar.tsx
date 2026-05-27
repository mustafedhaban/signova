import * as React from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Building2, Mail, Plus, Settings, ShieldCheck, Users } from 'lucide-react';
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
  SidebarRail,
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
  if (pathname.startsWith('/organizations')) return NAV_MAIN.find((n) => n.id === 'organizations')!;
  if (pathname.startsWith('/settings')) return NAV_MAIN.find((n) => n.id === 'settings')!;
  if (tab === 'teams') return NAV_MAIN.find((n) => n.id === 'teams')!;
  return NAV_MAIN.find((n) => n.id === 'signatures')!;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { signatures, isLoading: signaturesLoading } = useSignatures();
  const { isMobile, setOpenMobile } = useSidebar();
  const [search, setSearch] = React.useState('');

  const closeMobileSidebar = () => {
    if (isMobile) setOpenMobile(false);
  };

  const tab = searchParams.get('tab');
  const selectedId = searchParams.get('signature');
  const activeNav = resolveActiveNav(location.pathname, tab);
  const showSignatureList = activeNav.id === 'signatures' && location.pathname === '/';

  const filteredSignatures = signatures.filter((s) =>
    (s.name ?? '').toLowerCase().includes(search.toLowerCase()),
  );

  const selectNav = (item: NavItem) => {
    if (item.tab) {
      const next = new URLSearchParams();
      next.set('tab', item.tab);
      if (item.tab === 'signatures' && signatures[0]) {
        next.set('signature', signatures[0].id);
      }
      setSearchParams(next);
      if (location.pathname !== '/') navigate('/');
      closeMobileSidebar();
    } else {
      navigate(item.path);
      closeMobileSidebar();
    }
  };

  const selectSignature = (id: string) => {
    setSearchParams({ tab: 'signatures', signature: id });
    if (location.pathname !== '/') navigate('/');
    closeMobileSidebar();
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

          {showSignatureList ? (
            <>
              <Separator className="mx-2" />
              <SidebarGroup>
                <div className="flex items-center justify-between gap-2 px-2">
                  <SidebarGroupLabel className="px-0">Your signatures</SidebarGroupLabel>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    className="size-7 shrink-0 group-data-[collapsible=icon]:hidden"
                    onClick={() => navigate('/builder/new')}
                    aria-label="New signature"
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
                <div className="px-2 pb-2 group-data-[collapsible=icon]:hidden">
                  <SidebarInput
                    placeholder="Search signatures…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <SidebarGroupContent>
                  {signaturesLoading ? (
                    <p className="px-2 py-2 text-xs text-muted-foreground">Loading…</p>
                  ) : filteredSignatures.length === 0 ? (
                    <p className="px-2 py-2 text-xs text-muted-foreground">
                      {search ? 'No matches.' : 'No signatures yet.'}
                    </p>
                  ) : (
                    <SidebarMenu>
                      {filteredSignatures.map((sig) => (
                        <SidebarMenuItem key={sig.id}>
                          <SidebarMenuButton
                            isActive={selectedId === sig.id}
                            onClick={() => selectSignature(sig.id)}
                            tooltip={`${sig.name || 'Untitled'} · ${sig.email}`}
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

      <SidebarFooter className="mt-auto border-t border-sidebar-border">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
