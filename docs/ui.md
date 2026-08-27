# UI Coding Standards

This document defines the coding standards for all UI work in this project. It applies to every page, layout, and feature across the codebase.

## Components: shadcn/ui only

- All UI must be built exclusively from [shadcn/ui](https://ui.shadcn.com) components (`src/components/ui/`).
- **Do not create custom components.** No hand-rolled buttons, inputs, cards, modals, dropdowns, date pickers, etc. If a piece of UI is needed, add the corresponding shadcn component via the CLI (`npx shadcn@latest add <component>`) rather than writing it from scratch.
- If a needed component doesn't exist yet in `src/components/ui/`, add it from the shadcn registry first — do not improvise a substitute.
- Composition of shadcn primitives directly in pages/routes is expected and fine (e.g. using `Popover` + `Calendar` together). What's disallowed is authoring new, non-shadcn presentational components.
- Do not fork or hand-edit generated shadcn component files beyond what the CLI produces, unless fixing a genuine bug in the generated code.

## Dates: date-fns only

- All date formatting must use [`date-fns`](https://date-fns.org). Do not use `Intl.DateTimeFormat`, `Date.prototype.toLocaleDateString`, or other ad-hoc formatting.
- Dates displayed in the UI must use the ordinal-day format with a capitalized, abbreviated month:

  ```
  1st Sep 2025
  2nd Aug 2025
  3rd Jan 2026
  4th Jun 2024
  ```

- Use the `date-fns` format string `"do MMM yyyy"`:

  ```ts
  import { format } from "date-fns";

  format(date, "do MMM yyyy"); // "1st Sep 2025"
  ```

- Apply this format consistently anywhere a date is shown to the user. Machine-facing date strings (e.g. URL query params, API payloads) are not subject to this display format and should use an unambiguous format such as `yyyy-MM-dd`.
