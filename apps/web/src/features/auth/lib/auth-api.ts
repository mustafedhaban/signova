import { API_BASE } from '@/lib/api';

type AuthTokens = { access_token: string; refresh_token: string };

async function postJson<T>(path: string, body: unknown): Promise<{ ok: boolean; data: T; status: number }> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = (await response.json()) as T;
  return { ok: response.ok, data, status: response.status };
}

export async function loginWithPassword(email: string, password: string) {
  return postJson<AuthTokens & { message?: string }>('/auth/login', { email, password });
}

export async function loginDev(email: string) {
  return postJson<AuthTokens & { message?: string }>('/auth/dev-login', { email });
}

export async function registerAccount(email: string, name: string, password: string) {
  return postJson<AuthTokens & { message?: string }>('/auth/register', { email, name, password });
}

export async function forgotPassword(email: string) {
  return postJson<{ devResetUrl?: string; message?: string }>('/auth/forgot-password', { email });
}

export async function resetPassword(token: string, password: string) {
  return postJson<AuthTokens & { message?: string | string[] }>('/auth/reset-password', {
    token,
    password,
  });
}
