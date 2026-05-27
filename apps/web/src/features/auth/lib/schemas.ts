import { z } from 'zod';

export const loginSchema = z
  .object({
    email: z.string().min(1, 'Email is required.').email('Please enter a valid email address.'),
    password: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const pwd = data.password?.trim() ?? '';
    if (pwd.length > 0 && pwd.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Password must be at least 8 characters, or leave blank for dev sign-in.',
        path: ['password'],
      });
    }
  });

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(1, 'Name is required.').min(2, 'Name must be at least 2 characters.'),
    email: z.string().min(1, 'Email is required.').email('Please enter a valid email address.'),
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
