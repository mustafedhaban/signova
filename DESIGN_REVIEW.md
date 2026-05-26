# Design Review: Signova Application

Reviewed against: `PLAN.md` (no `DESIGN_BRIEF.md` or `.design/` folder found — product intent inferred from plan: production SaaS email signature builder, Signature Hound–inspired)

Philosophy: Not formally named in-repo. Implementation reads as **professional SaaS** with bold uppercase micro-labels, oversized rounded cards (`rounded-[2rem]`), coral-red OKLCH primary tokens, soft shadows, and light motion (`animate-in-up`, spring easing).

Date: May 26, 2026

## Fixes applied (May 26, 2026)

All **Must fix** and **Should fix** items from this review have been implemented: semantic success tokens, dark-mode-safe surfaces, `AuthLayout` with theme toggle, mobile full-width layouts, typography alignment (Nunito only), reduced-motion support, `PageLoading`, `AlertDialog` delete flow, navbar-integrated mobile menu, and touch-visible signature card actions.

## Screenshots Captured

| Screenshot | Breakpoint | Description |
| --- | --- | --- |
| `screenshots/review-login-desktop-1280.png` | Desktop (1280×800) | Login (system dark) |
| `screenshots/review-login-tablet-768.png` | Tablet (768×1024) | Login |
| `screenshots/review-login-mobile-375.png` | Mobile (375×812) | Login — content left-anchored |
| `screenshots/review-login-light-mode-desktop-1280.png` | Desktop (1280×800) | Login forced light theme |
| `screenshots/review-dashboard-empty-desktop-1280.png` | Desktop (1280×800) | Dashboard empty state with sidebar |
| `screenshots/review-dashboard-empty-tablet-768.png` | Tablet (768×1024) | Dashboard without sidebar, tabs visible |
| `screenshots/review-dashboard-empty-mobile-375.png` | Mobile (375×812) | Dashboard mobile — narrow empty card |
| `screenshots/review-builder-new-desktop-1280.png` | Desktop (1280×800) | Signature builder (new) |

> All screenshots are in `screenshots/` at the project root (no `.design/<feature-slug>/` folder exists yet).

Captured at `http://localhost:5174` with API at `http://localhost:3000`.

## Summary

Signova already has a recognizable product skin: consistent red primary, rounded “soft” cards, and a clear dashboard → builder flow. Light mode on auth pages looks polished; dark mode is coherent in the shell but breaks in several nested surfaces. The biggest gaps are **responsive layout on narrow viewports**, **hardcoded light colors inside dark UI**, **unused / mismatched typography setup**, and **accessibility** (hover-only actions, no reduced-motion, auth pages without theme control).

## Must Fix

1. **Hardcoded light surfaces in dark mode**: Several components use `bg-white`, `bg-green-50`, `border-green-100`, etc., which read as broken patches in dark mode. Examples: `Builder.tsx` save-success toast (~297), preview well (`bg-white dark:bg-zinc-950` ~597 is partial), `SocialLinksEditor.tsx` (~162), `BrandingPanel.tsx` (~209), `Settings.tsx` alerts (~131, ~202), `CSVUploader.tsx` (~199, ~281). See `screenshots/review-builder-new-desktop-1280.png`. _Fix: Replace with semantic tokens (`bg-card`, `bg-muted`, `text-success` pattern using CSS variables)._

2. **Mobile layout does not use full width**: On 375px, login and dashboard empty states sit in the left column with large unused space on the right. See `screenshots/review-login-mobile-375.png` and `screenshots/review-dashboard-empty-mobile-375.png`. _Fix: Ensure outer wrappers use `w-full`, `mx-auto`, and `max-w-*` together; audit `App.tsx` / page roots for missing `width: 100%`; test with real device metrics._

3. **Typography system is inconsistent**: `index.css` sets `--font-sans: 'Nunito Sans Variable'` and imports Noto Sans + Playfair Display, but `--font-heading` equals `--font-sans` (Playfair never used). `tailwind.config.js` still maps `sans` to Inter and `display` to Cal Sans — neither matches runtime CSS. _Fix: Align Tailwind `fontFamily` with CSS variables; remove unused font packages or wire Playfair to display headings intentionally._

4. **Auth flows lack theme control**: `ThemeToggle` exists on `Navbar.tsx` but not on login/register/forgot-password. Users on system dark see dark auth (see `review-login-desktop-1280.png`) with no in-page override. _Fix: Add `ThemeToggle` to auth layout or a shared `AuthLayout`._

5. **Signature card actions are hover-only**: `SignatureCard.tsx` hides edit/delete/copy behind `opacity-0 group-hover:opacity-100` (~74), unusable on touch and poor for keyboard users. _Fix: Always show primary actions on mobile (`max-lg:opacity-100`) or use a persistent overflow menu._

## Should Fix

1. **Duplicate / conflicting base styles**: `index.css` repeats `* { border-border }` and `body` rules in two `@layer base` blocks (lines 10–133 and 165–172). _Fix: Consolidate into one block._

2. **Loading and error states are generic**: Dashboard uses plain “Loading...” / error text without layout chrome (`Dashboard.tsx` ~28–41). _Fix: Reuse the app spinner pattern from `App.tsx` Suspense fallback for visual continuity._

3. **Destructive confirm uses `window.confirm`**: `Dashboard.tsx` ~19. _Fix: Use `AlertDialog` (already in codebase) for accessible, styled confirmation._

4. **Invalid / nonstandard Tailwind sizes**: `w-4.5 h-4.5` in `Sidebar.tsx` and `Navbar.tsx` may not resolve unless custom spacing exists. _Fix: Use `w-[18px]` or standard `w-4` / `w-5`._

5. **Mobile sidebar overlap**: `AppLayout.tsx` places the menu button `absolute top-4 left-4` while navbar reserves only `w-10` spacer — risk of overlap on small screens. See `screenshots/review-dashboard-empty-mobile-375.png`. _Fix: Integrate menu into navbar row or increase header left padding on `lg:hidden`._

6. **Builder mobile split**: Editor is `h-[50vh]` on small screens (`Builder.tsx` ~338) — reasonable pattern but untested in screenshots. _Fix: Capture mobile builder screenshots in next pass; ensure preview remains reachable without excessive scroll._

7. **Success / status colors not tokenized**: Green status dots and success buttons use raw `green-500` rather than semantic success tokens. _Fix: Add `--success` / `success` color to theme if product uses status heavily._

8. **No `prefers-reduced-motion`**: Custom animations (`animate-in-up`, `animate-pulse` on empty state, `rotate-3` accents) run unconditionally. _Fix: Wrap motion utilities in `@media (prefers-reduced-motion: reduce)` overrides._

## Could Improve

1. **Micro-label density**: Heavy use of `text-[10px] uppercase tracking-widest` on nav, tabs, and labels creates a strong brand voice but can hurt readability for some users. Consider slightly larger caption tokens (11–12px) for secondary nav.

2. **Empty state vertical rhythm**: Dashboard empty card has fixed `h-[500px]` (`Dashboard.tsx` ~74), which feels tall on tablet/mobile. _Suggestion: Use `min-h` + responsive padding instead of fixed height._

3. **Light mode polish**: Light login (`review-login-light-mode-desktop-1280.png`) is cleaner than dark auth; consider making light the default for marketing/auth and dark for app shell only.

4. **Design documentation**: Add `.design/signova-app/DESIGN_BRIEF.md` with named philosophy, type scale, and spacing rules so future work can be reviewed against explicit intent.

5. **Consolidate shadow tokens**: `shadow-soft` is defined in Tailwind but many components also use ad hoc `shadow-2xl shadow-primary/30`. _Suggestion: Document 2–3 elevation levels in tokens._

## What Works Well

- **OKLCH CSS variables** in `index.css` give a cohesive coral primary and sensible dark palette; components mostly consume `bg-primary`, `text-muted-foreground`, etc.
- **Auth card composition** (icon badge, `rounded-[2rem]` card, clear CTA) reads professional in light mode and matches a SaaS signup pattern.
- **App shell** (sidebar + sticky navbar + tabbed main) is clear; desktop hierarchy in `review-dashboard-empty-desktop-1280.png` makes “New Signature” easy to find.
- **Builder layout** on desktop separates editor and live preview well; macOS-style preview chrome is a nice touch (`review-builder-new-desktop-1280.png`).
- **Mobile sidebar pattern** (drawer + backdrop blur) in `AppLayout.tsx` is implemented with sensible transitions.
- **Theme toggle** on authenticated pages (`theme-toggle.tsx` + `next-themes`) works; dark dashboard shell feels intentional.
- **shadcn/ui + CVA buttons** include `focus-visible:ring` — good baseline for keyboard focus when actions are visible.

## Checklist Notes (by category)

| Category | Pass | Needs work |
| --- | --- | --- |
| Visual hierarchy | ✓ Desktop shell | Mobile width usage |
| Consistency | ✓ Card radius / primary | Hardcoded whites/greens; font config drift |
| Aesthetic fidelity | ~ Partial | No brief; direction is clear but uneven in dark |
| Component quality | ✓ shadcn patterns | Hover-only card actions |
| States & interactions | ~ Partial | Missing reduced-motion; generic loading |
| Responsive | ~ Tablet OK | Mobile 375 login/dashboard |
| Accessibility | ~ Focus rings on buttons | Contrast on micro-text; touch targets on hidden actions |
| Typography | ✓ Nunito loads | Unused fonts; Tailwind mismatch |
| Dark mode | ~ Shell | Nested light surfaces |
| Mobile-first | ~ Sidebar drawer | Content not full-bleed on 375px |
