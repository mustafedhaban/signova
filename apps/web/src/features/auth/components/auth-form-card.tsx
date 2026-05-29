type AuthFormCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AuthFormCard({ title, description, children, footer }: AuthFormCardProps) {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">{title}</h2>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </header>
      {children}
      {footer ? (
        <p className="border-t border-border pt-6 text-center text-sm text-muted-foreground">{footer}</p>
      ) : null}
    </div>
  );
}
