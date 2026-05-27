import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ShieldCheck, Sparkles, Users } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const highlights = [
  { icon: Sparkles, text: 'Brand-consistent signatures for every teammate' },
  { icon: Users, text: 'Team templates, roles, and organization controls' },
  { icon: ShieldCheck, text: 'Secure accounts with optional password sign-in' },
];

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <div className="flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary-foreground/15 ring-1 ring-primary-foreground/20">
            <ShieldCheck className="size-5" aria-hidden />
          </span>
          <span className="font-heading text-lg font-semibold tracking-tight">Signova</span>
        </div>

        <div className="space-y-6">
          <h2 className="max-w-sm font-heading text-3xl font-semibold leading-tight tracking-tight">
            Professional email signatures for modern teams
          </h2>
          <ul className="space-y-4 text-sm text-primary-foreground/90">
            {highlights.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-primary-foreground/10">
                  <Icon className="size-4" aria-hidden />
                </span>
                <span className="leading-relaxed">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-primary-foreground/70">&copy; {new Date().getFullYear()} Signova Inc.</p>
      </aside>

      <div className="relative flex flex-col bg-background">
        <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
          <ThemeToggle />
        </div>
        <main className="flex flex-1 flex-col items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;
