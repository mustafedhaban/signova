import * as React from 'react';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { cn } from '@/lib/utils';

type AuthIconFieldProps = {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  error?: { message?: string };
  children: React.ReactElement;
};

export function AuthIconField({ id, label, description, icon, error, children }: AuthIconFieldProps) {
  const invalid = Boolean(error?.message);

  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="group relative">
        <span
          className="pointer-events-none absolute left-2.5 top-1/2 z-10 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary [&_svg]:size-4"
          aria-hidden
        >
          {icon}
        </span>
        {React.cloneElement(children, {
          id,
          'aria-invalid': invalid,
          className: cn('h-10 pl-9', children.props.className),
        })}
      </div>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <FieldError errors={error ? [error] : undefined} />
    </Field>
  );
}
