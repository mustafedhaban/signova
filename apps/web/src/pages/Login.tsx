import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { loginDev, loginWithPassword } from '@/features/auth/lib/auth-api';
import { loginSchema, type LoginFormValues } from '@/features/auth/lib/schemas';
import { AuthFormCard } from '@/features/auth/components/auth-form-card';
import { AuthIconField } from '@/features/auth/components/auth-icon-field';
import { AuthPageHeader } from '@/features/auth/components/auth-page-header';
import AuthLayout from '@/components/AuthLayout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircle, ArrowRight, Lock, Mail } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError('');
    const password = values.password?.trim() ?? '';
    const usePassword = password.length >= 8;

    try {
      const result = usePassword
        ? await loginWithPassword(values.email, password)
        : await loginDev(values.email);

      if (!result.ok) {
        const message =
          (result.data as { message?: string }).message ?? 'Login failed. Please try again.';
        setServerError(message);
        return;
      }

      const { access_token, refresh_token } = result.data;
      login(access_token, refresh_token);
    } catch {
      setServerError('Unable to connect. Please try again.');
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <AuthPageHeader tagline="Sign in to manage your team signatures" />

        <AuthFormCard
          title="Welcome back"
          description="Use your password, or leave it blank for local dev sign-in"
          footer={
            <>
              New to Signova?{' '}
              <Link to="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
                Create a free account
              </Link>
            </>
          }
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <FieldGroup>
              <AuthIconField
                id="email"
                label="Email"
                icon={<Mail />}
                error={errors.email}
              >
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  {...register('email')}
                />
              </AuthIconField>

              <Field data-invalid={!!errors.password}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <PasswordInput
                  id="password"
                  leftIcon={<Lock />}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="h-10"
                  aria-invalid={!!errors.password}
                  {...register('password')}
                />
                <FieldDescription>Optional — leave empty for dev sign-in without a password</FieldDescription>
                <FieldError errors={errors.password ? [errors.password] : undefined} />
              </Field>
            </FieldGroup>

            {serverError ? (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertTitle>Could not sign in</AlertTitle>
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            ) : null}

            <div className="flex items-center justify-between gap-2">
              <Badge variant="outline" className="font-normal text-muted-foreground">
                Dev: email only
              </Badge>
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" disabled={isSubmitting} className="h-10 w-full" size="lg">
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-1.5 size-4" />
                </>
              )}
            </Button>
          </form>
        </AuthFormCard>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
