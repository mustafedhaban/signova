type AuthPageHeaderProps = {
  tagline?: string;
};

export function AuthPageHeader({ tagline }: AuthPageHeaderProps) {
  if (!tagline) return null;
  return <p className="text-sm text-muted-foreground">{tagline}</p>;
}
