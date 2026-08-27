# Routing Coding Standards

This document defines the coding standards for routing in this project. It applies to every route added under `src/app/` and to the middleware in `src/proxy.ts`.

## All app functionality lives under `/dashboard`

- Every feature page belongs under the `/dashboard` route segment (e.g. `src/app/dashboard/page.tsx`, `src/app/dashboard/workout/[workoutId]/page.tsx`, `src/app/dashboard/workout/new/page.tsx`).
- Do not add feature pages at the root of `src/app/` (e.g. `src/app/workouts/page.tsx`). The root `src/app/page.tsx` is the public marketing/landing page only.
- The only routes allowed outside `/dashboard` are:
  - `src/app/page.tsx` — the public landing page.
  - `src/app/sign-in/[[...sign-in]]/page.tsx` and `src/app/sign-up/[[...sign-up]]/page.tsx` — Clerk's conventional auth routes (see `docs/auth.md`).
- When adding a new feature area, nest it under `src/app/dashboard/<feature>/...` rather than creating a new top-level segment.

## `/dashboard` and everything under it is a protected route

- Every route under `/dashboard` must only be reachable by a signed-in user. There is no page under `/dashboard` that should be publicly viewable.
- Do not rely on client-side checks (`<Show when="signed-in">`, a `useEffect` redirect, or hiding UI conditionally) to protect these pages — those only hide UI, they don't prevent direct navigation or data access. Protection must happen before the page renders.

## Route protection must be done in Next.js middleware

- Enforce protection for `/dashboard` (and everything nested under it) in `src/proxy.ts`, using `auth.protect()` inside the `clerkMiddleware(async (auth, req) => { ... })` callback — not with per-page `auth()` + `redirect()` checks.
- Do not remove or narrow the existing `matcher` in `src/proxy.ts` to "fix" a routing issue for a new page — the matcher must keep covering `/dashboard` routes. Adjust the middleware callback logic instead of the matcher when a new protected path needs different treatment.
- Example shape for protecting `/dashboard`:

  ```ts
  import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

  const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

  export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
      await auth.protect();
    }
  });
  ```

- Server Components/Actions/data-access functions under `/dashboard` should still scope queries by `auth()`'s `userId` as described in `docs/auth.md` — middleware protection guarantees a signed-in request reaches the page, but data access must still be scoped to that specific user, not just "some" signed-in user.
