---
paths:
  - "src/**/*.css"
  - "src/**/*.tsx"
  - "postcss.config.mjs"
---

# Tailwind CSS v4

- Configuration is CSS-first. There is no `tailwind.config.js`; the entry is `@import "tailwindcss";` in `src/app/globals.css` and design tokens live in an `@theme { }` block there. Do not create a JS config file.
- Add custom colours, fonts, and spacing as `@theme` variables (`--color-brand: oklch(...)`). They automatically generate utilities (`bg-brand`, `text-brand`).
- Class-based dark mode must be declared explicitly in `globals.css`:
  ```css
  @custom-variant dark (&:where(.dark, .dark *));
  ```
  Without this, `dark:` utilities only respond to `prefers-color-scheme`, and a manual switcher will not work.
- Prefer semantic tokens over per-element `dark:` pairs when a value is reused. Define `--color-surface` / `--color-surface-dark` in `@theme`, or use CSS variables that flip under `.dark`, so components do not need `bg-white dark:bg-gray-900` on every node.
- Renamed utilities in v4: `shadow-sm` → `shadow-xs`, `shadow` → `shadow-sm`, `rounded-sm` → `rounded-xs`, `rounded` → `rounded-sm`, `outline-none` → `outline-hidden`, `ring` defaults to 1px (use `ring-3` for the old 3px). Opacity uses the slash syntax: `bg-black/25`, not `bg-black bg-opacity-25`.
- Use `@apply` sparingly and only inside `@layer base` or `@layer components`. Component styling belongs in JSX class lists.
- Merge conditional class names with a helper (`clsx` + `tailwind-merge`, usually exported as `cn()`), not string concatenation.
- Component libraries: if the library ships its own styling engine (MUI, Mantine, Chakra), integrate its theme provider in the root layout and let it own dark mode. If it is Tailwind-native (shadcn/ui, Headless UI, Radix primitives, daisyUI), keep everything in `globals.css` and `@theme`.
- Keep mobile-first ordering: base classes, then `md:`, `lg:`, `xl:` in ascending order.
