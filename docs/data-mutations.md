# Data Mutations

## Database mutations must go through `/data` helper functions

- All database writes (create/update/delete) must be done through helper functions defined in the `/data` directory (e.g. `src/data/`).
- These helper functions must use **Drizzle ORM** to perform the mutation.
- **Never write raw SQL.** All mutations go through Drizzle's query builder / schema-typed APIs.
- Server actions call these `/data` helper functions to mutate data — they should not construct mutation queries inline.

## All mutations must be done via Server Actions in `actions.ts` files

- Every data mutation must be triggered through a **Server Action** (`"use server"`).
- Server Actions must live in files named `actions.ts`, colocated with the feature they belong to (e.g. `src/app/workouts/actions.ts`).
- Do NOT perform mutations from Route Handlers (`route.ts` / API routes) or from Client Components directly.

## Server Action parameters must be typed — no `FormData`

- Every Server Action must declare **explicit, typed parameters** (e.g. `string`, `number`, or a typed object) for its arguments.
- ❌ Do NOT type a Server Action's parameter as `FormData`.
- ✅ Call Server Actions with plain typed arguments from the client (e.g. `updateWorkout({ id, name })`), not by passing a `FormData` object from a `<form action={...}>`.

## All Server Actions must validate arguments with Zod

- Every Server Action must validate its incoming arguments using a **Zod** schema before doing anything else (before calling any `/data` helper).
- If validation fails, the Server Action must return/throw an error and must NOT proceed to call the `/data` helper or touch the database.
- Define the Zod schema alongside the Server Action (in the same `actions.ts` file, or imported from a shared schema module) and derive the action's parameter types from it (`z.infer<typeof schema>`) so the schema and the typed parameters can't drift apart.

## Do not call `redirect()` inside a Server Action

- Server Actions must NOT call Next.js's `redirect()` (from `next/navigation`).
- Instead, the Server Action should return normally (or return a result indicating success), and the calling Client Component must perform the redirect (e.g. via `useRouter().push(...)`) after `await`ing the Server Action call resolves.
- This keeps navigation as a client-side concern and avoids relying on `redirect()`'s throw-based control flow inside a mutation.

## Data mutation access must be scoped to the logged-in user

This is critically important: **a logged-in user must only ever be able to mutate their own data.**

- Every `/data` helper function that creates, updates, or deletes user-owned data (e.g. workouts, lifts, diary entries) must filter/scope by the authenticated user's ID.
- Never mutate rows belonging to another user, under any circumstance.
- There is no "admin" or "bypass" mode for mutating other users' data from these helpers.
- Always derive the current user's ID from the server-side auth context (e.g. Clerk's server-side `auth()`) inside the Server Action or `/data` helper — do not accept a user ID from client input as the sole means of scoping a mutation.
