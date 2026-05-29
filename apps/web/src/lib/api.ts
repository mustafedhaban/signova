/** API base URL (override with VITE_API_URL in .env). */
export const API_BASE = (
  import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1'
).replace(/\/$/, '');
