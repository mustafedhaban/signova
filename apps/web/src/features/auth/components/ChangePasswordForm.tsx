import { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SectionCard } from '@/components/layout/section-card';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { PasswordInput } from '@/components/ui/password-input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircle, CheckCircle2, KeyRound, Lock } from 'lucide-react';
import { toast, toastApiError } from '@/lib/toast';

const API = 'http://localhost:3000/api/v1/auth/change-password';

const schema = (hasPassword: boolean) =>
  z
    .object({
      currentPassword: hasPassword
        ? z.string().min(1, 'Current password is required.')
        : z.string().optional(),
      newPassword: z.string().min(8, 'New password must be at least 8 characters.'),
      confirmPassword: z.string().min(1, 'Please confirm your new password.'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'New passwords do not match.',
      path: ['confirmPassword'],
    });

type FormValues = z.infer<ReturnType<typeof schema>>;

interface ChangePasswordFormProps {
  hasPassword: boolean;
  onSuccess?: () => void;
}

const ChangePasswordForm = ({ hasPassword, onSuccess }: ChangePasswordFormProps) => {
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema(hasPassword)),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError('');
    setSuccess(false);

    try {
      await axios.post(API, {
        ...(hasPassword ? { currentPassword: values.currentPassword } : {}),
        newPassword: values.newPassword,
      });
      setSuccess(true);
      toast.success(hasPassword ? 'Password updated' : 'Password set successfully');
      reset();
      onSuccess?.();
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: unknown) {
      toastApiError(err, 'Failed to update password.');
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string | string[] } } }).response?.data
              ?.message
          : undefined;
      setServerError(
        Array.isArray(message)
          ? message.join(', ')
          : typeof message === 'string'
            ? message
            : 'Failed to update password.',
      );
    }
  };

  return (
    <SectionCard
      icon={KeyRound}
      title="Password"
      description={
        hasPassword
          ? 'Change your account password'
          : 'Set a password to sign in with email and password'
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FieldGroup>
          {hasPassword ? (
            <Field data-invalid={!!errors.currentPassword}>
              <FieldLabel htmlFor="currentPassword">Current password</FieldLabel>
              <PasswordInput
                id="currentPassword"
                leftIcon={<Lock />}
                autoComplete="current-password"
                className="h-10"
                aria-invalid={!!errors.currentPassword}
                {...register('currentPassword')}
              />
              <FieldError errors={errors.currentPassword ? [errors.currentPassword] : undefined} />
            </Field>
          ) : null}
          <Field data-invalid={!!errors.newPassword}>
            <FieldLabel htmlFor="newPassword">New password</FieldLabel>
            <PasswordInput
              id="newPassword"
              leftIcon={<Lock />}
              autoComplete="new-password"
              className="h-10"
              aria-invalid={!!errors.newPassword}
              {...register('newPassword')}
            />
            <FieldError errors={errors.newPassword ? [errors.newPassword] : undefined} />
          </Field>
          <Field data-invalid={!!errors.confirmPassword}>
            <FieldLabel htmlFor="confirmPassword">Confirm new password</FieldLabel>
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
            <AlertTitle>Update failed</AlertTitle>
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        ) : null}

        {success ? (
          <Alert className="border-success/30 bg-success/10 text-success">
            <CheckCircle2 className="size-4" />
            <AlertDescription>Password updated successfully.</AlertDescription>
          </Alert>
        ) : null}

        <Button type="submit" disabled={isSubmitting} className="h-10">
          {isSubmitting ? (
            <>
              <Spinner className="mr-2" />
              Updating…
            </>
          ) : hasPassword ? (
            'Change password'
          ) : (
            'Set password'
          )}
        </Button>
      </form>
    </SectionCard>
  );
};

export default ChangePasswordForm;
