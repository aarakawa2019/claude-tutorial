# Data Fetching

## ALL data fetching must happen in Server Components

This is a hard rule. **All** data fetching in this app is done via React Server Components — no exceptions.

- ❌ Do NOT fetch data in Route Handlers (`route.ts` / API routes).
- ❌ Do NOT fetch data in Client Components (`"use client"`), including via `useEffect`, `fetch`, SWR, React Query, etc.
- ❌ Do NOT introduce any other data-fetching mechanism (GraphQL clients, tRPC, external fetch libraries, etc.).
- ✅ Data is fetched exclusively in Server Components, then passed down as props to Client Components if interactivity is needed.

If a page or component needs data and interactivity, split it: keep the Server Component as the data-fetching parent, and pass fetched data as props into a Client Component child for interactivity.

## Database queries must go through `/data` helper functions

- All database access must be done through helper functions defined in the `/data` directory (e.g. `src/data/`).
- These helper functions must use **Drizzle ORM** to query the database.
- **Never write raw SQL.** All queries go through Drizzle's query builder / schema-typed APIs.
- Server Components call these `/data` helper functions to fetch data — they should not construct queries inline.

## Data access must be scoped to the logged-in user

This is critically important: **a logged-in user must only ever be able to access their own data.**

- Every helper function in `/data` that reads or writes user-owned data (e.g. workouts, lifts, diary entries) must filter/scope by the authenticated user's ID.
- Never return or mutate rows belonging to another user, under any circumstance.
- There is no "admin" or "bypass" mode for reading other users' data from these helpers.
- When adding a new `/data` helper, always derive the current user's ID from the server-side auth context (e.g. Clerk's server-side `auth()`) and include it in the query's `WHERE` clause (via Drizzle) — do not accept a user ID from client input as the sole means of scoping a query.
