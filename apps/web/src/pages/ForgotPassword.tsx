import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { forgotPassword } from '@/features/auth/lib/auth-api';
import { AuthFormCard } from '@/features/auth/components/auth-form-card';
import { AuthIconField } from '@/features/auth/components/auth-icon-field';
import { AuthPageHeader } from '@/features/auth/components/auth-page-header';
import AuthLayout from '@/components/AuthLayout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircle, ArrowRight, CheckCircle2, Mail } from 'lucide-react';

const schema = z.object({
  email: z.string().min(1, 'Email is required.').email('Please enter a valid email address.'),
});

type FormValues = z.infer<typeof schema>;

const ForgotPasswordPage = () => {
  const [serverError, setServerError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError('');
    try {
      const result = await forgotPassword(values.email);
      if (!result.ok) {
        setServerError(result.data.message ?? 'Something went wrong. Please try again.');
        return;
      }
      setDevResetUrl(result.data.devResetUrl ?? '');
      setSubmitted(true);
    } catch {
      setServerError('Unable to connect. Please try again.');
    }
  };

  if (submitted) {
    return (
      <AuthLayout>
        <div className="space-y-6">
          <AuthPageHeader tagline="If an account exists, we sent reset instructions" />
          <AuthFormCard
            title="Check your email"
            description="Follow the link in the message to choose a new password"
            footer={
              <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
                Back to sign in
              </Link>
            }
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-success/10 text-success">
                <CheckCircle2 className="size-6" />
              </span>
              {devResetUrl ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    Development mode: use this link to reset locally.
                  </p>
                  <Link
                    to={devResetUrl}
                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Continue to reset password
                    <ArrowRight className="size-4" />
                  </Link>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Did not receive it? Check spam or try again in a few minutes.
                </p>
              )}
            </div>
          </AuthFormCard>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <AuthPageHeader tagline="We will email you a link to reset your password" />
        <AuthFormCard
          title="Forgot password?"
          description="Enter the email associated with your account"
          footer={
            <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
              Back to sign in
            </Link>
          }
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <FieldGroup>
              <AuthIconField id="email" label="Email" icon={<Mail />} error={errors.email}>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  {...register('email')}
                />
              </AuthIconField>
            </FieldGroup>

            {serverError ? (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertTitle>Request failed</AlertTitle>
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            ) : null}

            <Button type="submit" disabled={isSubmitting} className="h-10 w-full" size="lg">
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2" />
                  Sending…
                </>
              ) : (
                'Send reset link'
              )}
            </Button>
          </form>
        </AuthFormCard>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
