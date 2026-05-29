import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { loginDev, loginWithPassword } from '@/features/auth/lib/auth-api';
import { loginSchema, type LoginFormValues } from '@/features/auth/lib/schemas';
import { AuthFormCard } from '@/features/auth/components/auth-form-card';
import { AuthIconField } from '@/features/auth/components/auth-icon-field';
import AuthLayout from '@/components/AuthLayout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
      <AuthFormCard
        title="Sign in"
        description="Access your signatures and team settings."
        footer={
          <>
            No account?{' '}
            <Link to="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
              Register
            </Link>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <FieldGroup>
            <AuthIconField id="email" label="Work email" icon={<Mail />} error={errors.email}>
              <Input
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                className="h-10"
                {...register('email')}
              />
            </AuthIconField>

            <Field data-invalid={!!errors.password}>
              <div className="flex items-center justify-between gap-2">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <PasswordInput
                id="password"
                leftIcon={<Lock />}
                autoComplete="current-password"
                placeholder="••••••••"
                className="h-10"
                aria-invalid={!!errors.password}
                {...register('password')}
              />
              <FieldDescription>Leave blank in local dev to sign in with email only.</FieldDescription>
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

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full cursor-pointer transition-[background-color,transform] duration-200 ease-[var(--ease-out)] active:scale-[0.99]"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Spinner className="mr-2" />
                Signing in…
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="ml-1.5 size-4" />
              </>
            )}
          </Button>
        </form>
      </AuthFormCard>
    </AuthLayout>
  );
};

export default LoginPage;
