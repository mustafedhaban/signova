import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Mail } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="grid min-h-svh lg:grid-cols-[1.05fr_1fr]">
      <aside className="light relative hidden overflow-hidden bg-primary text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
          aria-hidden
        />
        <div className="relative z-10 flex items-center gap-3 p-10">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary-foreground/10 ring-1 ring-primary-foreground/15">
            <Mail className="size-5" strokeWidth={2} aria-hidden />
          </span>
          <span className="font-heading text-xl font-semibold tracking-tight">Signova</span>
        </div>

        <div className="relative z-10 space-y-8 px-10 pb-4">
          <div className="max-w-md space-y-4">
            <h1 className="text-balance font-heading text-4xl font-semibold leading-[1.1] tracking-tight">
              Email signatures your whole team can ship today
            </h1>
            <p className="max-w-sm text-sm leading-relaxed text-primary-foreground/75">
              Build once, copy HTML, paste into Gmail or Outlook. No design files, no IT queue.
            </p>
          </div>

          <div className="max-w-sm rounded-xl border border-primary-foreground/10 bg-primary-foreground/[0.06] p-5 shadow-soft backdrop-blur-sm">
            <p className="text-[10px] font-medium uppercase tracking-widest text-primary-foreground/50">
              Live preview
            </p>
            <div className="mt-3 space-y-1 border-l-2 border-[oklch(0.588_0.158_241.966)] pl-3">
              <p className="text-sm font-semibold">Alex Morgan</p>
              <p className="text-xs text-primary-foreground/70">Head of Marketing</p>
              <p className="pt-2 text-xs text-primary-foreground/60">alex@signova.com</p>
            </div>
          </div>
        </div>

        <p className="relative z-10 px-10 pb-10 text-xs text-primary-foreground/50">
          &copy; {new Date().getFullYear()} Signova
        </p>
      </aside>

      <div className="relative flex flex-col bg-background">
        <div className="absolute right-4 top-4 z-10 sm:right-8 sm:top-8">
          <ThemeToggle />
        </div>
        <main className="flex flex-1 flex-col items-center justify-center px-6 pb-12 pt-16 sm:px-10 sm:pt-12">
          <div className="mb-8 flex w-full max-w-[420px] items-center gap-2 lg:hidden">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Mail className="size-4" aria-hidden />
            </span>
            <span className="font-heading text-lg font-semibold">Signova</span>
          </div>
          <div className="w-full max-w-[420px]">{children}</div>
        </main>
        <footer className="pb-8 text-center text-xs text-muted-foreground lg:hidden">
          <Link to="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
            Create account
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default AuthLayout;
