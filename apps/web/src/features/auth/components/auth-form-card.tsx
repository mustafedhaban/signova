import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type AuthFormCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

export function AuthFormCard({ title, description, children, footer }: AuthFormCardProps) {
  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader className="border-b border-border/60 pb-4">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">{children}</CardContent>
      <Separator />
      <CardFooter className="justify-center py-4 text-xs text-muted-foreground">{footer}</CardFooter>
    </Card>
  );
}
