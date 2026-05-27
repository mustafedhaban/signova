import { cn } from '@/lib/utils';

type PageShellProps = {
  children: React.ReactNode;
  className?: string;
  size?: 'md' | 'lg' | 'full';
};

const maxWidth = {
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  full: 'max-w-7xl',
};

export function PageShell({ children, className, size = 'full' }: PageShellProps) {
  return (
    <div className={cn('flex-1 overflow-y-auto bg-muted/30 p-4 sm:p-8', className)}>
      <div className={cn('mx-auto w-full space-y-6', maxWidth[size])}>{children}</div>
    </div>
  );
}
