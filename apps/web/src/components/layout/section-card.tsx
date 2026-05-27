import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type SectionCardProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: React.ReactNode;
  variant?: 'default' | 'destructive';
  className?: string;
};

export function SectionCard({
  icon: Icon,
  title,
  description,
  children,
  variant = 'default',
  className,
}: SectionCardProps) {
  const destructive = variant === 'destructive';

  return (
    <Card
      className={cn(
        destructive && 'border-destructive/30 bg-destructive/[0.02]',
        className,
      )}
    >
      <CardHeader className="border-b border-border/60">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              'flex size-10 shrink-0 items-center justify-center rounded-lg',
              destructive ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary',
            )}
          >
            <Icon className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 space-y-1">
            <CardTitle className={cn('text-base', destructive && 'text-destructive')}>{title}</CardTitle>
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">{children}</CardContent>
    </Card>
  );
}
