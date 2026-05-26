/** Strip empty strings so optional URL/UUID fields are omitted from API requests. */
export function toSignatureApiPayload<T extends Record<string, unknown>>(data: T): T {
  const payload = { ...data } as Record<string, unknown>;

  for (const key of [
    'website',
    'logoUrl',
    'organizationId',
    'phone',
    'mobile',
    'title',
    'company',
    'department',
    'address',
  ]) {
    if (payload[key] === '') {
      delete payload[key];
    }
  }

  return payload as T;
}
