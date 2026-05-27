import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface PasswordInputProps extends Omit<React.ComponentProps<typeof Input>, 'type'> {
  /** Optional icon shown on the left (e.g. Lock inside auth forms) */
  leftIcon?: React.ReactNode;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, leftIcon, id, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false);
    const inputId = id ?? props.name;

    return (
      <div className={cn('relative', leftIcon && 'group')}>
        {leftIcon ? (
          <div className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary [&_svg]:h-4 [&_svg]:w-4">
            {leftIcon}
          </div>
        ) : null}
        <Input
          ref={ref}
          id={inputId}
          type={visible ? 'text' : 'password'}
          className={cn(leftIcon ? 'pl-11' : undefined, 'pr-11', className)}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-controls={inputId}
          aria-pressed={visible}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    );
  },
);

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
