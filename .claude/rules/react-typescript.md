---
paths:
  - "src/**/*.tsx"
  - "src/**/*.ts"
---

# React 19 + TypeScript

## State

- State updates must be immutable. When merging an edit into an existing object, the edited values go **last**: `{ ...existing, ...changes }`. The reverse order silently discards the change.
- When the next state depends on the previous state (toggles, appends, counters), use the functional form: `setItems(prev => [...prev, item])`.
- Derive values during render instead of mirroring them into state. If it can be computed from props or other state, do not `useState` it.
- Lift state only as high as the lowest common ancestor that needs it. Reach for context or a store only when prop drilling crosses three or more levels.

## Components

- One exported component per file, named the same as the file, in PascalCase.
- Type props with an `interface XProps` above the component. Avoid `React.FC`.
- `ref` is a regular prop in React 19; do not use `forwardRef` in new code.
- Prefer `useActionState` and `useOptimistic` for form submissions over hand-rolled `isSubmitting` flags.
- `key` must be a stable identity (`book.id`), never the array index for lists that reorder or delete.
- Do not use `window.alert`, `window.confirm`, or `window.prompt`. Use an in-app dialog, toast, or inline confirmation.

## Forms

- Controlled inputs must never receive `undefined` as `value`. Provide a default (`value={formData.title ?? ""}`) or initialise every field.
- Parse numeric inputs explicitly and guard `NaN` (`Number.isNaN(parseFloat(v)) ? 0 : ...`).
- Every input needs an associated `<label htmlFor>` or `aria-label`.

## TypeScript

- `strict` is on; do not weaken it and do not add `// @ts-ignore`. Use `// @ts-expect-error` with a reason if truly unavoidable.
- Avoid `as` casts to widen types (e.g. `newBook as Book`). Narrow with a type guard or build the full object explicitly.
- Prefer `interface` for object shapes and `type` for unions and utilities.
- Use `import type` for type-only imports.
- Export shared domain types from `src/types/` rather than redefining them inline.

## Accessibility

- Interactive elements are `<button>` or `<a>`, never a `<div onClick>`.
- Modals need `role="dialog"`, `aria-modal="true"`, an accessible name, Escape-to-close, and focus returned to the trigger on close. Prefer a headless or component-library dialog that handles this.
- Icon-only buttons need `aria-label`.
- Star ratings must be operable by keyboard and expose the current value (`aria-label="4 of 5 stars"` or a `radiogroup`).
