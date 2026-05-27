import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { resetPassword } from '@/features/auth/lib/auth-api';
import { AuthFormCard } from '@/features/auth/components/auth-form-card';
import { AuthPageHeader } from '@/features/auth/components/auth-page-header';
import AuthLayout from '@/components/AuthLayout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { PasswordInput } from '@/components/ui/password-input';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircle, ArrowRight, Lock } from 'lucide-react';

const schema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [serverError, setServerError] = useState('');
  const token = searchParams.get('token') || '';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (!token) setServerError('Missing or invalid reset token.');
  }, [token]);

  const onSubmit = async (values: FormValues) => {
    if (!token) return;
    setServerError('');

    try {
      const result = await resetPassword(token, values.password);
      if (!result.ok) {
        const msg = result.data.message;
        setServerError(
          Array.isArray(msg) ? msg.join(', ') : (msg as string) || 'Invalid or expired token.',
        );
        return;
      }
      login(result.data.access_token, result.data.refresh_token);
    } catch {
      setServerError('Unable to connect. Please try again.');
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <AuthPageHeader tagline="Choose a new password for your account" />
        <AuthFormCard
          title="New password"
          description="Enter and confirm your new password"
          footer={
            <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
              Back to sign in
            </Link>
          }
        >
          {!token ? (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertTitle>Invalid link</AlertTitle>
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <FieldGroup>
                <Field data-invalid={!!errors.password}>
                  <FieldLabel htmlFor="password">New password</FieldLabel>
                  <PasswordInput
                    id="password"
                    leftIcon={<Lock />}
                    autoComplete="new-password"
                    className="h-10"
                    aria-invalid={!!errors.password}
                    {...register('password')}
                  />
                  <FieldError errors={errors.password ? [errors.password] : undefined} />
                </Field>
                <Field data-invalid={!!errors.confirmPassword}>
                  <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
                  <PasswordInput
                    id="confirmPassword"
                    leftIcon={<Lock />}
                    autoComplete="new-password"
                    className="h-10"
                    aria-invalid={!!errors.confirmPassword}
                    {...register('confirmPassword')}
                  />
                  <FieldError errors={errors.confirmPassword ? [errors.confirmPassword] : undefined} />
                </Field>
              </FieldGroup>

              {serverError ? (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertTitle>Could not reset password</AlertTitle>
                  <AlertDescription>{serverError}</AlertDescription>
                </Alert>
              ) : null}

              <Button type="submit" disabled={isSubmitting} className="h-10 w-full" size="lg">
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2" />
                    Updating…
                  </>
                ) : (
                  <>
                    Reset password
                    <ArrowRight className="ml-1.5 size-4" />
                  </>
                )}
              </Button>
            </form>
          )}
        </AuthFormCard>
      </div>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
