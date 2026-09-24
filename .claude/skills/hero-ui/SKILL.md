---
name: hero-ui
description: Use when building or changing any UI in this Book Store with HeroUI v3 (@heroui/react, @heroui/styles) — cards, modals, alert dialogs, toasts, forms, text/number fields, switches, chips, buttons, theme switcher, dark mode, oklch theme tokens, BEM class overrides — or when unsure which HeroUI component or prop to use. Keywords HeroUI, Hero UI, heroui, next-themes, React Aria, Tailwind v4.
---

# HeroUI v3 for the LEAP Book Store

HeroUI v3 is a compound-component library built on **Tailwind CSS v4** and **React Aria Components**. It is the chosen component library for this repo (see `CLAUDE.md`). Two packages: `@heroui/react` (components) and `@heroui/styles` (CSS, tokens, BEM classes, variant functions).

## v3 only. Ignore v2 knowledge.

| v2 (never write this)                       | v3 (write this)                                |
| ------------------------------------------- | ---------------------------------------------- |
| `<HeroUIProvider>` / `<NextUIProvider>`     | **No provider.** Import CSS and use components |
| `framer-motion` peer dep                    | CSS animations, no extra dep                   |
| `@heroui/theme` + `tailwind.config.js`      | `@import "@heroui/styles"` in `globals.css`    |
| Flat props `<Card title="x">`               | Compound `<Card><Card.Header><Card.Title>`     |
| `useDisclosure`, `<Modal isOpen>`           | `isOpen` / `onOpenChange` on `Modal.Backdrop`  |
| `onClick`, `disabled`, `color="primary"`    | `onPress`, `isDisabled`, `variant="primary"`   |
| `<Divider>`, `<Text>`                       | `<Separator>`, `<Typography>`                  |

Every component doc in `reference/components/` shows the v3 anatomy. Read it before using a component for the first time.

## Setup in this repo (pnpm)

```bash
pnpm add @heroui/react @heroui/styles next-themes @gravity-ui/icons
```

`react-aria-components` is a peer dependency that pnpm auto-installs. If the build complains it is missing, add it explicitly.

1. `src/app/globals.css` — order matters, Tailwind first:
   ```css
   @import "tailwindcss";
   @import "@heroui/styles";
   ```
   Remove the old `@theme` and `@layer base` blocks; HeroUI supplies tokens. Do **not** add `@custom-variant dark`; HeroUI's `.dark` / `data-theme="dark"` handling already covers it.
2. `src/app/providers.tsx` (client) wraps `next-themes` `ThemeProvider` with `attribute="class"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`, and renders `<Toast.Provider />` once.
3. `src/app/layout.tsx` — `<html lang="en" suppressHydrationWarning>` and `<body className="bg-background text-foreground">` wrapping `<Providers>`.
4. Theme switcher is a client component using `useTheme` from `next-themes`, gated on a `mounted` flag. Full code in `reference/dark-mode.md`.

## Book Store task → component map

| Need                            | Use                                                                                                    | Reference                                       |
| ------------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| Book card                       | `Card` + `Card.Header/Title/Description/Content/Footer`; keep `next/image` inside                       | `components/card.md`                            |
| Add / edit form dialog          | `Modal` with `Modal.Backdrop isOpen onOpenChange` → `Container` → `Dialog` → `Header/Body/Footer`        | `components/modal.md` (Controlled State)        |
| Delete confirmation             | `AlertDialog` (same anatomy, `AlertDialog.Icon status="danger"`, footer buttons `slot="close"`)          | `components/alert-dialog.md`                    |
| Success / undo feedback         | `toast("Book deleted", { variant: "success" })`; needs `<Toast.Provider />` mounted once                 | `components/toast.md`                           |
| Form wrapper + validation       | `Form` with `onSubmit`, fields use `isRequired`, `validate`, `<FieldError />`                            | `components/form.md`                            |
| Text inputs                     | `TextField` → `Label` + `Input` (+ `Description`, `FieldError`); `TextArea` for description             | `components/text-field.md`, `text-area.md`      |
| Price / pages / stock           | `NumberField` with `minValue`, `step`, `formatOptions={{style:"currency",currency:"AUD"}}`               | `components/number-field.md`                    |
| Genres                          | `Chip` (display) or `TagGroup` (editable)                                                              | `components/chip.md`, `tag-group.md`            |
| Theme toggle                    | `Switch` or two `Button`s driven by `next-themes`                                                        | `dark-mode.md`, `components/switch.md`          |
| 5-star rating                   | **No Rating component.** Build with `RadioGroup` (radiogroup semantics) or `ToggleButtonGroup`, star icons from `@gravity-ui/icons`, `aria-label="N of 5 stars"` | `components/toggle-button-group.md` |
| Icons                           | `@gravity-ui/icons` (what the docs use); HeroUI ships none                                              |                                                 |

## Semantic variants

`primary` (one per view), `secondary`, `tertiary` (cancel/dismiss), `danger` (destructive), `ghost`, `outline`. Sizes `sm | md | lg`. Never reach for raw colour utilities on a HeroUI component when a variant exists.

## Theming quick reference

- Tokens are CSS variables read by Tailwind utilities: `bg-background`, `text-foreground`, `bg-surface`, `text-muted`, `bg-accent text-accent-foreground`, `bg-danger-soft text-danger-soft-foreground`, `border-border`, `shadow-surface`, `rounded-lg` (scales from `--radius`).
- Override in `globals.css` after the imports: `:root { --accent: oklch(0.62 0.19 254); --radius: 0.75rem; }` and `.dark, [data-theme="dark"] { ... }`.
- New semantic colour: define `--info` / `--info-foreground` in both blocks, then expose with `@theme inline { --color-info: var(--info); }`.
- Full variable list and light/dark defaults: `reference/colors.md`. Custom theme file pattern: `reference/theming.md`.

## Styling components

1. `className` on any component or sub-part (Tailwind utilities, merged with the BEM base).
2. Render-prop `className={({isPressed}) => ...}` for state-driven styles.
3. Global override in `globals.css`: `@layer components { .button--primary { @apply font-semibold; } }`. Class names are BEM: `.card`, `.card__header`, `.button--danger`.
4. Reusable variant: `tv({ extend: buttonVariants, ... })` from `@heroui/styles`.
5. Style a `next/link` as a button: `className={buttonVariants({variant:"primary"})}`.
Details in `reference/styling.md` and `reference/composition.md`.

## Looking things up

1. `reference/components/<name>.md` (33 components cached locally, anatomy + full prop tables).
2. `reference/component-index.txt` for the full component list and doc URLs.
3. Live docs: `node .claude/skills/hero-ui/scripts/get_component_docs.mjs Modal` or fetch `https://heroui.com/docs/react/components/<kebab-name>.mdx`.
4. Theme variables from the installed package: `node .claude/skills/hero-ui/scripts/get_theme.mjs`.

## Common mistakes

- Adding `HeroUIProvider` or `framer-motion`. Neither exists in v3.
- Putting `isOpen` on `<Modal>` instead of `<Modal.Backdrop>`.
- Forgetting `"use client"` on files that use `onPress`, `useTheme`, or `toast()`.
- Calling `toast()` without a mounted `<Toast.Provider />`.
- Reading `theme` from `next-themes` during SSR render; gate on `mounted`.
- Importing `@heroui/styles` before `tailwindcss`.
- Hard-coding `bg-white` / `text-gray-700`; use `bg-surface` / `text-muted` so dark mode works for free.
- `onChange` on `TextField` gives a `string`, on `NumberField` a `number | undefined`; on the raw `Input` it is a DOM event.
