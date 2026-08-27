# Auth Coding Standards

This document defines the coding standards for all authentication and authorization work in this project. It applies to every page, layout, server action, route handler, and data-access function across the codebase.

## Provider: Clerk only

- All authentication is handled by [Clerk](https://clerk.com) via the `@clerk/nextjs` package. Do not introduce another auth library (NextAuth, Lucia, custom JWT/session handling, etc.).
- Do not hand-roll sign-in, sign-up, or user-profile UI. Use Clerk's prebuilt components (`SignIn`, `SignUp`, `SignInButton`, `SignUpButton`, `UserButton`, `Show`) rather than building custom forms — this is also required by the shadcn-only rule in `docs/ui.md`, since Clerk's auth UI is not shadcn.
- The root layout (`src/app/layout.tsx`) wraps the app in `<ClerkProvider>`. Do not add a second provider or duplicate this wrapping in nested layouts/pages.
- Middleware in `src/proxy.ts` calls `clerkMiddleware()` and must keep matching `/((?!_next|...).*)`, `/(api|trpc)(.*)`, and `/__clerk/:path*`. Do not bypass or remove this middleware to "fix" a routing issue — adjust the matcher instead if a new path needs different treatment.

## Sign-in / sign-up routes

- Sign-in and sign-up live at the Clerk-conventional catch-all routes: `src/app/sign-in/[[...sign-in]]/page.tsx` and `src/app/sign-up/[[...sign-up]]/page.tsx`, rendering `<SignIn />` and `<SignUp />` respectively.
- For inline/modal sign-in entry points elsewhere in the UI (e.g. a nav bar), use `<SignInButton mode="modal" />` / `<SignUpButton mode="modal" />` as in `src/app/page.tsx`, not a custom link to `/sign-in`.

## Conditional rendering by auth state

- Use Clerk's `<Show when="signed-in">` / `<Show when="signed-out">` to conditionally render UI based on auth state on the client, as in `src/app/page.tsx`. Do not reimplement this with a manual `useUser()`/`useAuth()` loading check unless `Show` genuinely cannot express the case.

## Server-side auth checks

- In server-only code (Server Components, Server Actions, data-access functions), get the current user with `auth()` from `@clerk/nextjs/server`, always `await`ed:

  ```ts
  import { auth } from "@clerk/nextjs/server";

  const { userId } = await auth();
  ```

- Any function that reads or writes user-scoped data must check `userId` and short-circuit (e.g. return `[]`, throw, or redirect) when it's `null` — never assume a caller is authenticated. See `src/data/workouts.ts` for the pattern: unauthenticated calls return an empty result rather than querying the database.
- Files performing these server-only checks should be marked `import "server-only";` at the top, matching `src/data/workouts.ts`, so they can never be accidentally imported into client code.

## Database ↔ Clerk user linkage

- User-owned rows are scoped by `clerkUserId` (see `workoutsTable` in `src/db/schema.ts`), which stores the Clerk `userId` directly. Do not introduce a separate local `users` table/id as the source of truth for identity — Clerk's `userId` is the identity key.
- Every query or mutation against user-owned tables must filter/scope by the authenticated `clerkUserId` obtained from `auth()`. Never accept a user id from client input (query params, form fields, request body) as the scoping identity for a data access — always derive it server-side from `auth()`.

## Route protection

- Prefer enforcing auth in `clerkMiddleware()` (`src/proxy.ts`) or at the top of server components/actions via `auth()`, not in client components with `useEffect` redirects.
- If a route needs to require sign-in, use `auth.protect()` inside the middleware's `clerkMiddleware(async (auth, req) => { ... })` callback, or call `auth()` and `redirect()` at the top of the server component — do not gate access purely by hiding UI with `<Show>`, since that does not prevent direct navigation or data access.
