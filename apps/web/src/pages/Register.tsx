import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { registerAccount } from '@/features/auth/lib/auth-api';
import { registerSchema, type RegisterFormValues } from '@/features/auth/lib/schemas';
import { AuthFormCard } from '@/features/auth/components/auth-form-card';
import { AuthIconField } from '@/features/auth/components/auth-icon-field';
import AuthLayout from '@/components/AuthLayout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircle, ArrowRight, Lock, Mail, User } from 'lucide-react';

const RegisterPage = () => {
  const { login } = useAuth();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError('');

    try {
      const result = await registerAccount(values.email, values.name.trim(), values.password);

      if (!result.ok) {
        const message =
          (result.data as { message?: string }).message ?? 'Registration failed. Please try again.';
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
        title="Create account"
        description="Start with one signature. Add your team later."
        footer={
          <>
            Already registered?{' '}
            <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
              Sign in
            </Link>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <FieldGroup>
            <AuthIconField id="name" label="Name" icon={<User />} error={errors.name}>
              <Input
                type="text"
                autoComplete="name"
                placeholder="Alex Morgan"
                className="h-10"
                {...register('name')}
              />
            </AuthIconField>

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
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <PasswordInput
                id="password"
                leftIcon={<Lock />}
                autoComplete="new-password"
                placeholder="At least 8 characters"
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
                placeholder="Repeat password"
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
              <AlertTitle>Could not create account</AlertTitle>
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
                Creating account…
              </>
            ) : (
              <>
                Create account
                <ArrowRight className="ml-1.5 size-4" />
              </>
            )}
          </Button>
        </form>
      </AuthFormCard>
    </AuthLayout>
  );
};

export default RegisterPage;
