import React from 'react';

interface PageLoadingProps {
  label?: string;
}

const PageLoading: React.FC<PageLoadingProps> = ({ label = 'Loading Signova...' }) => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">{label}</p>
      </div>
    </div>
  );
};

export default PageLoading;
