# Implementation Plan: Disable Google Auth

## Overview

Remove Google OAuth from the Signova app and replace it with a minimal dev login (email → JWT). Google-specific code is commented out with `// TODO: Re-enable Google OAuth` markers. The JWT flow, `useAuth`, and all protected routes remain untouched.

## Tasks

- [x] 1. Add DevLoginDto and update AuthService
  - [x] 1.1 Create `apps/api/src/auth/dto/dev-login.dto.ts` with `email` field validated via `@IsEmail()` from `class-validator`
    - _Requirements: 5.1, 5.3_
  - [x] 1.2 In `apps/api/src/auth/auth.service.ts`, comment out `validateOAuthUser` with `// TODO: Re-enable Google OAuth` and add `devLogin(email: string)` method that upserts a user (`provider: "dev"`, `name` defaults to email prefix) and returns `{ access_token, user }`
    - _Requirements: 5.2, 5.4, 7.4_
  - [ ]* 1.3 Write property test for `AuthService.devLogin` — Property 1: Dev login with valid email upserts user and issues JWT
    - Use `fc.emailAddress()` to generate valid emails; assert `access_token` is non-empty, JWT `email` claim matches input, exactly one DB user exists
    - **Property 1: Dev login with valid email upserts user and issues JWT**
    - **Validates: Requirements 5.2, 5.4**
  - [ ]* 1.4 Write property test for `AuthService.devLogin` — Property 2: Invalid email is rejected without side effects
    - Use `fc.string()` filtered to exclude valid emails; assert 400 is returned and no user is created
    - **Property 2: Invalid email is rejected without side effects**
    - **Validates: Requirements 5.3**

- [x] 2. Update AuthController — remove Google routes, add devLogin endpoint
  - [x] 2.1 In `apps/api/src/auth/auth.controller.ts`, comment out `googleAuth` and `googleAuthRedirect` handlers (with `// TODO: Re-enable Google OAuth`), add `@Post('dev-login')` handler that accepts `DevLoginDto` and delegates to `authService.devLogin`; add required imports (`Post`, `Body`, `BadRequestException`)
    - _Requirements: 2.1, 2.2, 2.3, 5.1, 5.2_
  - [ ]* 2.2 Write unit tests for `AuthController` — valid email returns 200 + token; invalid email returns 400
    - _Requirements: 5.2, 5.3_

- [x] 3. Disable GoogleStrategy and update AuthModule
  - [x] 3.1 In `apps/api/src/auth/strategies/google.strategy.ts`, comment out the entire file body with `// TODO: Re-enable Google OAuth` markers (keep the file, wrap contents in block comment)
    - _Requirements: 3.1, 7.1, 7.3, 7.4_
  - [x] 3.2 In `apps/api/src/auth/auth.module.ts`, remove the `GoogleStrategy` import and remove it from the `providers` array; keep all JWT wiring intact
    - _Requirements: 3.1, 3.2, 3.3_

- [x] 4. Checkpoint — verify backend compiles and JWT flow is intact
  - Ensure all tests pass and the API starts without `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, or `GOOGLE_CALLBACK_URL` set. Ask the user if questions arise.

- [x] 5. Update frontend — replace Google button with dev login form
  - [x] 5.1 Rewrite `apps/web/src/pages/Login.tsx` to replace the Google Sign-In button with a controlled email `<input>` and submit button; on submit call `POST /api/v1/auth/dev-login`, then call `login(access_token)` from `useAuth`; show inline validation error on empty/invalid email or API failure
    - _Requirements: 1.1, 1.2, 1.3, 5.1, 5.2, 5.3_
  - [ ]* 5.2 Write unit tests for `Login.tsx` — renders email input, no Google button, shows error on empty submit, calls `login()` on success
    - _Requirements: 1.1, 5.3_

- [x] 6. Update AuthCallback page
  - [x] 6.1 Rewrite `apps/web/src/pages/AuthCallback.tsx` to immediately call `navigate('/login')` on mount; remove token processing and `login()` call; keep the file in place
    - _Requirements: 4.1, 4.2_

- [x] 7. Final checkpoint — end-to-end validation
  - [ ]* 7.1 Write property test for JWT gating — Property 3: JWT validation gates protected routes
    - Generate valid payloads with `fc.record({ email: fc.emailAddress(), sub: fc.uuid() })`, sign with real JWT secret; assert `GET /auth/profile` returns 200. Generate invalid tokens with `fc.string()`; assert 401.
    - **Property 3: JWT validation gates protected routes**
    - **Validates: Requirements 6.1, 6.3**
  - [ ]* 7.2 Write integration tests — app starts without Google env vars; `GET /auth/google` returns 404; `GET /auth/google/callback` returns 404; full dev login flow (POST email → JWT → GET /auth/profile)
    - _Requirements: 2.1, 2.2, 2.3, 3.2, 6.1, 6.2_
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Google OAuth code is commented out (not deleted) with `// TODO: Re-enable Google OAuth` for easy restoration
- `JwtStrategy`, `useAuth`, `ProtectedRoute`, and all non-auth modules are untouched
- Property tests use [fast-check](https://github.com/dubzzz/fast-check) with a minimum of 100 iterations each
