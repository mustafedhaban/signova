import { Spinner } from '@/components/ui/spinner';

interface PageLoadingProps {
  label?: string;
}

const PageLoading = ({ label = 'Loading…' }: PageLoadingProps) => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <Spinner className="size-8" />
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
};

export default PageLoading;
