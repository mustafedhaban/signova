# Signova

Self-hosted email signature builder for NGOs and teams (React + NestJS monorepo).

## Quick start

```bash
pnpm install
cp apps/api/.env.example apps/api/.env   # edit JWT secrets + optional mail

cd apps/api && pnpm prisma:push && pnpm prisma:seed
cd apps/api && pnpm dev                  # http://localhost:3000

cd apps/web && pnpm dev                  # http://localhost:5173
```

Set `FRONTEND_URL` in `apps/api/.env` to match the Vite port if it auto-increments (e.g. `5174`).

## Scripts (from repo root)

```bash
pnpm --filter @signova/api dev
pnpm --filter @signova/web dev
pnpm --filter @signova/api prisma:seed
pnpm format    # Prettier write
pnpm lint      # ESLint in api + web
```

## Deployment

### API (NestJS)

1. Provision a host (Railway, Render, Fly.io, etc.) with Node 20+.
2. Use PostgreSQL in production: set `DATABASE_URL` and run `prisma migrate deploy` (migrate from SQLite when ready).
3. Set environment variables from `apps/api/.env.example`:
   - `JWT_SECRET`, `REFRESH_TOKEN_SECRET`
   - `FRONTEND_URL` (production web URL, HTTPS)
   - Mail: `RESEND_API_KEY` or SMTP vars + `MAIL_FROM`
4. Build: `pnpm --filter @signova/api build`
5. Start: `node apps/api/dist/main.js` (or platform start command).

### Web (Vite static)

1. Build with API URL baked in or same-origin proxy:
   ```bash
   cd apps/web && pnpm build
   ```
2. Deploy `apps/web/dist` to Vercel, Netlify, or static hosting behind nginx.
3. Ensure CORS on the API allows your web origin.

### Checklist

- [ ] HTTPS on both app and API
- [ ] Strong JWT secrets (not dev defaults)
- [ ] Transactional email configured (not console provider)
- [ ] `FRONTEND_URL` matches deployed web app
- [ ] Database backups enabled

## Docs

- [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) — agent onboarding
- [.kiro/ROADMAP.md](./.kiro/ROADMAP.md) — product roadmap
- [.kiro/tasks.md](./.kiro/tasks.md) — build milestones
