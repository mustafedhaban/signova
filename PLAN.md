# Signova - Project Plan

## Overview
Production-ready SaaS email signature builder inspired by Signature Hound.

## Monorepo Structure
- `/apps/web`: React (Vite + TS) frontend.
- `/apps/api`: NestJS backend.
- `/packages/types`: Shared TypeScript interfaces.

## Tech Stack
- **Frontend**: React, Tailwind CSS, shadcn/ui, React Query, React Hook Form + Zod.
- **Backend**: NestJS, PostgreSQL, Prisma ORM, JWT, Passport.
- **Authentication**: Google OAuth, Microsoft OAuth.

## Roadmap
1. [x] **Planning**: Folder structure, shared types, API design, component hierarchy.
2. [x] **Setup**: Initialize monorepo, setup apps and shared packages.
3. [ ] **Auth System**: Backend OAuth/JWT, Frontend auth flow.
4. [ ] **Signature System**: CRUD operations for signatures.
5. [ ] **Builder**: Real-time signature editor with templates.
6. [ ] **Export + Teams**: HTML export, CSV import for bulk creation.

## Shared Types
Interfaces for `IUser`, `ISignature`, `ISocialLink`, `ITeam`, `ITeamMember` defined in `/packages/types`.

## API Endpoints
- `/auth/google`: OAuth login.
- `/signatures`: CRUD for email signatures.
- `/teams/import`: CSV bulk creation.
- `/uploads/logo`: Image hosting.
