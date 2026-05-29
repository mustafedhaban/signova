import { Mail } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

interface PageLoadingProps {
  label?: string;
}

const PageLoading = ({ label = 'Loading…' }: PageLoadingProps) => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-background">
      <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft">
        <Mail className="size-5" strokeWidth={2} aria-hidden />
      </span>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner className="size-4" />
        {label}
      </div>
    </div>
  );
};

export default PageLoading;
