# Signova - Comprehensive Testing Strategy

## 1. Test Objectives
- Ensure high-fidelity rendering of email signatures across all templates.
- Guarantee secure data access: users must only manage their own signatures and teams.
- Validate robustness of CSV parsing and bulk signature creation.
- Confirm seamless OAuth flow and JWT session persistence.

## 2. Test Cases & Scenarios

### A. Functional Scenarios
- **TC-01: Auth**: User logs in via Google → User record created in DB → JWT returned → Profile accessible via JWT.
- **TC-02: Builder**: Create signature → Save → Signature appears in Dashboard → Edit → Save → Updates persist.
- **TC-03: Export**: Copy HTML for signature → HTML matches Template structure with user data.
- **TC-04: Teams**: Create Team → Upload CSV → 5 signatures created → Linked to Team.

### B. Edge Cases
- **TC-05: Empty Fields**: Create signature with only name and email. Template should skip empty optional fields (phone, mobile).
- **TC-06: Invalid CSV**: Upload CSV with missing required columns (e.g. no 'email'). System should return clear validation error.
- **TC-07: Malformed URLs**: Enter invalid Website URL in Builder. Form should show Zod validation error.

### C. Error Scenarios
- **TC-08: Forbidden Access**: User A attempts to GET/PATCH User B's signature ID. API must return `403 Forbidden`.
- **TC-09: Invalid JWT**: API requests with expired or malformed JWT must return `401 Unauthorized`.
- **TC-10: Database Error**: Prisma connection failure should be handled gracefully with a `500` error and logging.

## 3. Automation Strategy
- **Backend**: Jest for unit and integration tests (NestJS).
- **Frontend**: Vitest + React Testing Library for utility functions and hooks.
- **E2E (Manual/Optional)**: Playwright for full user journey verification.

## 5. Summary Report (Template)
| Test ID | Category | Description | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| TC-01 | Auth | Google Login Flow | ✅ Pass | Verified in Spec |
| TC-02 | Builder | Signature CRUD Logic | ✅ Pass | Verified in Service Spec |
| TC-03 | Export | HTML Template Generation | ✅ Pass | Verified in Utility Spec |
| TC-04 | Teams | CSV Import Bulk Creation | ✅ Pass | Verified in Controller Spec |
| TC-05 | Edge | Empty Fields Handling | ✅ Pass | Verified in Builder Spec |
| TC-08 | Security | Unauthorized Access (403) | ✅ Pass | Verified in Service Spec |

## 6. Identified Issues & Recommendations
- **Issue**: CSV Parsing is currently client-side. 
  - *Recommendation*: Move parsing to backend for better security and validation.
- **Issue**: Logo upload is URL-only. 
  - *Recommendation*: Implement S3/Cloudinary upload for production.
- **Issue**: Lack of E2E testing for the Builder's live preview. 
  - *Recommendation*: Add Playwright tests to verify the iframe content matches the form state.
