import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface NavbarProps {
  title: string;
  description?: string;
}

const Navbar = ({ title, description }: NavbarProps) => {
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-border/80 bg-background/95 px-4 backdrop-blur-sm supports-[backdrop-filter]:bg-background/80 sm:px-6">
      <SidebarTrigger className="-ml-1 shrink-0 cursor-pointer" />
      <Separator orientation="vertical" className="hidden h-4 sm:block" />
      <div className="min-w-0 flex-1">
        <h1 className="truncate font-heading text-base font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="truncate text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <ThemeToggle />
    </header>
  );
};

export default Navbar;
