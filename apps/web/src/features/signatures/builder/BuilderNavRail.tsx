import { Building2, Layout, Palette, User } from 'lucide-react';
import { useBuilder } from '@/features/signatures/builder/BuilderContext';
import { cn } from '@/lib/utils';

const SECTIONS = [
  { id: 'template', label: 'Templates', icon: Layout },
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'business', label: 'Business', icon: Building2 },
  { id: 'design', label: 'Design', icon: Palette },
] as const;

export function BuilderNavRail() {
  const { activeTab, setActiveTab } = useBuilder();

  return (
    <nav
      aria-label="Builder sections"
      className="flex h-auto max-h-none shrink-0 flex-row border-b border-border/80 bg-card lg:h-full lg:max-h-full lg:min-h-0 lg:w-[4.5rem] lg:flex-col lg:border-b-0 lg:border-r"
    >
      {SECTIONS.map(({ id, label, icon: Icon }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={cn(
              'flex min-w-0 flex-1 cursor-pointer flex-col items-center gap-1 border-b-2 px-1 py-2.5 text-[9px] font-semibold uppercase tracking-wide transition-colors lg:flex-none lg:gap-1.5 lg:border-b-0 lg:border-l-2 lg:py-4',
              active
                ? 'border-primary bg-primary/8 text-primary'
                : 'border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground',
            )}
          >
            <Icon className="size-4 shrink-0 lg:size-5" strokeWidth={1.75} />
            <span className="leading-tight">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
