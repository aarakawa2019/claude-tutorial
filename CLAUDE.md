# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — start dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run start` — run production build
- `npm run lint` — ESLint (flat config via `eslint.config.mjs`)

No test runner is configured yet.

## Code Generation Guidelines

Before writing any code, ALWAYS check the relevant doc file(s) in `/docs` first (e.g. `docs/ui.md` for UI work) and follow their guidance:

- /docs/ui.md
- /docs/data-fetching.md

## Docs

Before writing any code, ALWAYS check the relevant doc file(s) in `/docs` first (e.g. `docs/ui.md` for UI work) and follow their guidance.

## Architecture

This is a Next.js App Router project (Next 16.3.2, React 19, TypeScript, Tailwind CSS 4) currently at the freshly-scaffolded `create-next-app` state — no application code (e.g. lifting-diary features) has been built yet.

- `src/app/` — App Router root; `layout.tsx` and `page.tsx` define the root layout and home page
- `@/*` path alias maps to `src/*` (see `tsconfig.json`)
- Tailwind CSS 4 is wired through `@tailwindcss/postcss` in `postcss.config.mjs`, styles in `src/app/globals.css`

Per `AGENTS.md`, this Next.js version may differ from training-data assumptions — check `node_modules/next/dist/docs/` (subdirs `01-app`, `02-pages`, `03-architecture`) before relying on remembered Next.js APIs/conventions.
