import { ShieldCheck } from 'lucide-react';

type AuthPageHeaderProps = {
  tagline: string;
};

export function AuthPageHeader({ tagline }: AuthPageHeaderProps) {
  return (
    <div className="flex flex-col gap-1 text-center lg:text-left">
      <div className="flex items-center justify-center gap-2 lg:justify-start">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15">
          <ShieldCheck className="size-5" aria-hidden />
        </span>
        <span className="font-heading text-xl font-semibold tracking-tight">Signova</span>
      </div>
      <p className="text-sm text-muted-foreground">{tagline}</p>
    </div>
  );
}
