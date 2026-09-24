---
paths:
  - "src/app/**"
  - "next.config.ts"
---

# Next.js 15 App Router

## Server vs Client Components

- Every file under `src/app/` is a Server Component by default. Do not add `"use client"` to a page or layout unless the whole route genuinely needs client state.
- Push `"use client"` down to the smallest interactive leaf (a button, a form, a theme toggle). A client component can still receive Server Components as `children`.
- Never import server-only modules (`fs`, database clients, secrets) into a file that has `"use client"`. Mark shared server helpers with `import "server-only"`.
- Client components cannot be `async`. Server components can.

## Async request APIs (breaking in Next 15)

- `params` and `searchParams` are Promises. Type them as `Promise<{ id: string }>` and `await` them in the page/layout. In client components read them with `use()`.
- `cookies()`, `headers()`, and `draftMode()` are async and must be awaited.

## Caching defaults (changed in Next 15)

- `fetch` is **not** cached by default. Opt in with `{ cache: "force-cache" }` or `{ next: { revalidate: 60 } }`.
- `GET` route handlers are uncached by default. Export `export const dynamic = "force-static"` to opt in.
- Use `revalidatePath` / `revalidateTag` after mutations rather than manual refetching.

## Data mutations

- Prefer Server Actions (`"use server"`) over `pages/api`-style handlers for form submissions. Pair them with `useActionState` on the client for pending and error state.
- Validate every Server Action input on the server; treat it as a public HTTP endpoint.
- Route Handlers (`app/**/route.ts`) are for non-form clients (webhooks, external APIs, streaming).

## Routing and metadata

- Use `next/link` for internal navigation, never a raw `<a>`. Use `useRouter` from `next/navigation`, not `next/router`.
- Declare page metadata with `export const metadata: Metadata` or `generateMetadata`. Do not hand-write `<head>` tags.
- Use `loading.tsx`, `error.tsx` (must be a client component), and `not-found.tsx` for route-level states instead of ad-hoc conditionals.
- Group routes with `(group)` folders; keep colocated non-route files (components, utils) next to the route that uses them or in `src/components`.

## Images and fonts

- Always use `next/image`. With `fill`, also pass `sizes` so the browser picks the right srcset entry. Give above-the-fold images `priority`.
- Remote image hosts must be whitelisted in `next.config.ts` under `images.remotePatterns`.
- Load fonts with `next/font/google` or `next/font/local` in the root layout and apply via `className` or a CSS variable. Never link Google Fonts in `<head>`.

## Hydration

- Anything that reads `window`, `localStorage`, `matchMedia`, or `Date.now()` during render will mismatch on the server. Read it in `useEffect`, or gate the render with a mounted flag.
- For theme switching, set the class on `<html>` before hydration (inline script or `next-themes`) and add `suppressHydrationWarning` to `<html>`.

## Config

- `next.config.ts` is TypeScript. Keep it minimal; do not add `experimental` flags without a comment explaining why.
- Environment variables exposed to the browser must be prefixed `NEXT_PUBLIC_`. Everything else stays server-side.
