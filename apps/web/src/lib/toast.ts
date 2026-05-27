import { toast as sonner } from 'sonner';

export const toast = {
  success: (message: string) => sonner.success(message),
  error: (message: string) => sonner.error(message),
  info: (message: string) => sonner.info(message),
};

export function toastApiError(err: unknown, fallback = 'Something went wrong. Please try again.') {
  const message =
    err && typeof err === 'object' && 'response' in err
      ? (err as { response?: { data?: { message?: string | string[] } } }).response?.data?.message
      : undefined;
  if (Array.isArray(message)) {
    toast.error(message.join(', '));
    return;
  }
  if (typeof message === 'string' && message) {
    toast.error(message);
    return;
  }
  toast.error(fallback);
}
