# Requirements Document

## Introduction

This feature temporarily disables Google OAuth authentication from the Signova application. All Google OAuth integration code — including login buttons, callback handlers, token validation, and related API calls — will be removed or commented out. The application must continue to function properly by providing an alternative authentication method (email/password login) or guest access. All changes must be documented and no active Google auth dependencies should remain in the codebase.

## Glossary

- **Auth_System**: The authentication subsystem spanning both the NestJS API (`apps/api/src/auth`) and the React frontend (`apps/web/src/features/auth`).
- **Google_OAuth**: The Google OAuth 2.0 integration currently implemented via `passport-google-oauth20`, `GoogleStrategy`, and related controller routes.
- **JWT**: JSON Web Token used for stateless session management after authentication.
- **Guest_Access**: A mode that allows unauthenticated users to access the application without logging in.
- **Dev_Login**: A simplified, non-OAuth login mechanism (e.g., email/password or a single-click dev bypass) used as a replacement while Google OAuth is disabled.
- **Protected_Route**: A frontend route that requires a valid JWT token to access.
- **AuthCallback**: The frontend page (`/auth-callback`) that receives the OAuth redirect and stores the token.
- **Login_Page**: The frontend page (`/login`) that presents authentication options to the user.

---

## Requirements

### Requirement 1: Remove Google OAuth Login Button

**User Story:** As a developer, I want the Google Sign-In button removed from the Login page, so that users are not presented with a broken or disabled authentication option.

#### Acceptance Criteria

1. THE Login_Page SHALL NOT render a Google Sign-In button or any UI element that initiates a Google OAuth flow.
2. WHEN a user visits `/login`, THE Login_Page SHALL display an alternative authentication option (Dev_Login or guest access) in place of the Google Sign-In button.
3. THE Login_Page SHALL retain its existing layout and styling structure after the Google button is removed.

---

### Requirement 2: Disable Google OAuth Backend Routes

**User Story:** As a developer, I want the Google OAuth API routes disabled, so that no requests are routed through the Google OAuth flow.

#### Acceptance Criteria

1. THE Auth_System SHALL NOT expose a `GET /auth/google` endpoint while Google OAuth is disabled.
2. THE Auth_System SHALL NOT expose a `GET /auth/google/callback` endpoint while Google OAuth is disabled.
3. IF a request is made to a disabled Google OAuth route, THEN THE Auth_System SHALL return an HTTP 404 or 410 response indicating the endpoint is unavailable.
4. THE `GET /auth/profile` endpoint protected by JWT SHALL remain active and functional.

---

### Requirement 3: Disable Google Strategy Registration

**User Story:** As a developer, I want the GoogleStrategy removed from the NestJS auth module, so that the application does not attempt to initialize Google OAuth on startup.

#### Acceptance Criteria

1. THE Auth_System SHALL NOT register `GoogleStrategy` as a provider in `AuthModule` while Google OAuth is disabled.
2. THE Auth_System SHALL start successfully without `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, or `GOOGLE_CALLBACK_URL` environment variables being set.
3. THE `JwtStrategy` and JWT-based authentication SHALL remain fully operational after `GoogleStrategy` is removed.

---

### Requirement 4: Disable AuthCallback Page

**User Story:** As a developer, I want the AuthCallback page disabled or redirected, so that the OAuth redirect flow does not leave users on a broken page.

#### Acceptance Criteria

1. WHEN a user navigates to `/auth-callback`, THE Auth_System SHALL redirect the user to `/login` instead of attempting to process an OAuth token.
2. THE AuthCallback page SHALL NOT call `login()` with a token received from a Google OAuth redirect while Google OAuth is disabled.

---

### Requirement 5: Provide Alternative Authentication

**User Story:** As a developer, I want a working alternative login mechanism, so that the application remains usable while Google OAuth is disabled.

#### Acceptance Criteria

1. THE Login_Page SHALL provide a Dev_Login option that allows a user to authenticate using an email address without a Google OAuth flow.
2. WHEN a valid email is submitted via Dev_Login, THE Auth_System SHALL issue a JWT and store it in `localStorage` under the key `token`.
3. WHEN an invalid or empty email is submitted, THE Auth_System SHALL display a validation error message to the user.
4. THE Auth_System SHALL create or retrieve a user record in the database based on the submitted email when Dev_Login is used.
5. WHILE a valid JWT is present in `localStorage`, THE Protected_Route SHALL grant access to authenticated routes without requiring re-authentication.

---

### Requirement 6: Preserve JWT Authentication Flow

**User Story:** As a developer, I want the existing JWT authentication flow preserved, so that currently authenticated users and other JWT-dependent features are not broken.

#### Acceptance Criteria

1. THE Auth_System SHALL continue to validate JWT tokens on all routes guarded by `AuthGuard('jwt')`.
2. WHEN a valid JWT is present in the request `Authorization` header, THE Auth_System SHALL return the authenticated user's profile from `GET /auth/profile`.
3. IF a JWT is expired or invalid, THEN THE Auth_System SHALL return an HTTP 401 response.
4. THE `useAuth` hook SHALL continue to fetch the user profile via `GET /auth/profile` using the stored JWT token.

---

### Requirement 7: No Residual Google Auth Dependencies

**User Story:** As a developer, I want all active Google OAuth code paths removed or commented out, so that no Google auth logic executes at runtime.

#### Acceptance Criteria

1. THE Auth_System SHALL NOT import or instantiate `passport-google-oauth20` at runtime while Google OAuth is disabled.
2. THE Auth_System SHALL NOT make any outbound HTTP requests to Google OAuth endpoints at runtime.
3. THE Auth_System SHALL NOT reference `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, or `GOOGLE_CALLBACK_URL` environment variables in any active (non-commented) code path.
4. WHERE Google OAuth code is commented out rather than deleted, THE Auth_System SHALL include a `// TODO: Re-enable Google OAuth` comment marking each disabled block for future restoration.
