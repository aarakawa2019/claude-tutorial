# Server Components

This document defines coding standards for Server Components in this project. It applies to every `page.tsx`, `layout.tsx`, and `route.ts` across the codebase.

## `params` and `searchParams` must be awaited

This is a Next.js 15+ project. The `params` and `searchParams` props passed to Server Components (`page`, `layout`, `route`) are **Promises**, not plain objects.

- ❌ Do NOT access `params` or `searchParams` synchronously (e.g. `params.slug`).
- ✅ Always `await` them before reading any property:

  ```tsx
  export default async function Page({
    params,
  }: {
    params: Promise<{ workoutId: string }>;
  }) {
    const { workoutId } = await params;
    // ...
  }
  ```

- The same applies to `searchParams`:

  ```tsx
  export default async function Page({
    searchParams,
  }: {
    searchParams: Promise<{ date?: string | string[] }>;
  }) {
    const { date } = await searchParams;
    // ...
  }
  ```

- This applies in `layout.tsx` too, but avoid awaiting `params` at the top of a layout — doing so prevents the layout from being statically prerendered. Instead, pass the `params` promise down to the component that actually needs it and await there.
- In a Client Component page, use React's `use()` API (or the `useParams()` hook) to read `params` instead of awaiting it directly — `await` is not valid in a Client Component.

## Type `params`/`searchParams` explicitly

- Type dynamic segment `params` as `Promise<{ ... }>`, matching the route's folder structure (e.g. `app/dashboard/workout/[workoutId]/page.tsx` → `Promise<{ workoutId: string }>`).
- Route param values are always `string` (or `string[]` for catch-all segments) — never assume a numeric type. Coerce/validate (e.g. with `Number()` + `Number.isInteger`, or Zod) before using a param as an ID.
- Prefer the generated `PageProps<'/route'>` / `LayoutProps<'/route'>` / `RouteContext<'/route'>` helper types where available instead of hand-writing the params shape.

## Validate params before querying data

- Never pass a raw route param straight into a `/data` helper without validating its shape first (see `docs/data-fetching.md` for the `/data` helper rules).
- If a param fails validation (e.g. a non-numeric ID), call `notFound()` from `next/navigation` rather than letting the query fail or returning an unscoped result.
