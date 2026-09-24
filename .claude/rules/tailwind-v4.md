---
paths:
  - "src/**/*.css"
  - "src/**/*.tsx"
  - "postcss.config.mjs"
---

# Tailwind CSS v4

- Configuration is CSS-first. There is no `tailwind.config.js`; the entry is `@import "tailwindcss";` in `src/app/globals.css` and design tokens live in an `@theme { }` block there. Do not create a JS config file.
- Add custom colours, fonts, and spacing as `@theme` variables (`--color-brand: oklch(...)`). They automatically generate utilities (`bg-brand`, `text-brand`).
- The CSS entry is exactly `@import "tailwindcss";` followed by `@import "@heroui/styles";`. HeroUI supplies the design tokens and the `.dark` / `data-theme="dark"` handling, so do not add `@custom-variant dark` or a hand-written `@theme` colour palette. Overrides go in `:root` and `.dark` blocks after the imports.
- Prefer HeroUI semantic tokens (`bg-background`, `bg-surface`, `text-foreground`, `text-muted`, `border-border`, `bg-accent`) over per-element `dark:` pairs. `dark:` is for one-off adjustments only.
- Renamed utilities in v4: `shadow-sm` → `shadow-xs`, `shadow` → `shadow-sm`, `rounded-sm` → `rounded-xs`, `rounded` → `rounded-sm`, `outline-none` → `outline-hidden`, `ring` defaults to 1px (use `ring-3` for the old 3px). Opacity uses the slash syntax: `bg-black/25`, not `bg-black bg-opacity-25`.
- Use `@apply` sparingly and only inside `@layer base` or `@layer components`. Component styling belongs in JSX class lists.
- Merge conditional class names with a helper (`clsx` + `tailwind-merge`, usually exported as `cn()`), not string concatenation.
- The component library is HeroUI v3 (decision in `CLAUDE.md`). Use the `hero-ui` skill for component anatomy, theming, and BEM overrides. Do not add a second library.
- Keep mobile-first ordering: base classes, then `md:`, `lg:`, `xl:` in ascending order.
