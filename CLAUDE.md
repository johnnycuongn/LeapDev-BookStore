# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

LEAP Dev Next.js take-home test: a small Book Store with static data and in-memory CRUD. The assessment reviews both the code and the commit history, so keep commits small and descriptive. The README lists the five tasks to deliver (component library, dark mode with switcher, replace the delete `confirm()` with modern UX, 5-star rating, find and fix the planted bug) and asks for written explanations of the library choice and the bug fix in the README.

Stack: Next.js 15.5 (App Router), React 19, TypeScript (strict), Tailwind CSS v4 (CSS-first config, no `tailwind.config.js`), pnpm.

## Commands

```bash
pnpm install        # pnpm is the package manager (pnpm-lock.yaml, pnpm-workspace.yaml)
pnpm dev            # http://localhost:3000
pnpm build          # production build; also the only type-check gate (tsc runs inside next build)
pnpm start          # serve the production build
npx tsc --noEmit    # standalone type-check
```

There is no lint script, ESLint config, or test framework yet. `next lint` is deprecated in 15.5; if linting is added use `eslint-config-next` with a flat `eslint.config.mjs` and a `"lint": "eslint ."` script. If tests are added, Vitest + React Testing Library is the conventional pairing for this stack.

## Architecture

Single-page app. Everything lives under `src/`; `@/*` maps to `src/*`.

- `src/app/layout.tsx` is a minimal root layout (imports `globals.css`, no metadata, no fonts, no theme provider). Dark mode and any providers belong here.
- `src/app/page.tsx` is a `"use client"` component that owns all state: it imports `public/data.json` directly as the initial `Book[]` and keeps the working list in `useState`. Add, update, and delete are pure in-memory operations; nothing persists across reloads and there are no API routes or server actions.
- `src/components/` holds three presentational components: `BookCard` (grid item with Edit/Delete), `Modal` (unstyled overlay, no focus trap or Escape handling), and `BookForm` (controlled form covering only a subset of `Book` fields, used for both add and edit via the optional `book` prop).
- `src/types/book.ts` defines the `Book` interface. `rating` already exists as a `number` field (0-5 with decimals in the data), so the star rating task is a UI concern, not a schema change.
- `public/data.json` is the seed data; `public/images/covers/*.jpg` are local cover images referenced by `coverImage` as root-relative paths, rendered through `next/image` with `fill`.

Data flow: `page.tsx` → callbacks down to `BookCard` / `BookForm` → state updates back in `page.tsx`. The form submits `Partial<Book>`, and `page.tsx` merges it into the list.

## Things to know

- The planted bug is in `handleUpdateBook` in `src/app/page.tsx`: the merge is `{ ...updatedBook, ...book }`, so the original book overwrites every edited field and updates silently no-op. The fix is to reverse the spread order. The README asks for a written explanation of this.
- `handleAddBook` derives the new id with `Math.max(...ids) + 1`, which returns `-Infinity` when the list is empty.
- `src/app/page.module.css` is an unused leftover from `create-next-app` and can be removed.
- Tailwind v4 is configured in `src/app/globals.css` via `@import "tailwindcss"` and an `@theme` block. Class-based dark mode in v4 requires `@custom-variant dark (&:where(.dark, .dark *));` in that file; it is not configured yet.
- `BookCard` uses `bg-white` and hard-coded gray text colors, so it will need `dark:` variants or theme tokens once dark mode lands.

## Rules and agents

Coding conventions for Next.js 15 / React 19 / Tailwind v4 live in `.claude/rules/`. Specialised agents (`nextjs-developer`, `nextjs-code-reviewer`) live in `.claude/agents/`.
