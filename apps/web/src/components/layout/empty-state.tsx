import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type EmptyStateAction = {
  label: string;
  onClick: () => void;
};

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'mx-auto flex max-w-md flex-col items-center px-6 py-16 text-center',
        className,
      )}
    >
      <span className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary/8 text-[oklch(0.488_0.127_237.322)] ring-1 ring-border">
        <Icon className="size-7" strokeWidth={1.5} aria-hidden />
      </span>
      <h2 className="font-heading text-xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>
      {action || secondaryAction ? (
        <div className="mt-8 flex flex-col items-center gap-3">
          {action ? (
            <Button
              onClick={action.onClick}
              size="lg"
              className="h-11 cursor-pointer px-8 transition-[background-color,transform] duration-200 ease-[var(--ease-out)] active:scale-[0.99]"
            >
              {action.label}
            </Button>
          ) : null}
          {secondaryAction ? (
            <Button
              variant="ghost"
              onClick={secondaryAction.onClick}
              className="cursor-pointer text-muted-foreground hover:text-foreground"
            >
              {secondaryAction.label}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
