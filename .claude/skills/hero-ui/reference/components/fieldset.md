# Fieldset

**Category**: react
**URL**: https://heroui.com/en/docs/react/components/fieldset
**Source**: https://raw.githubusercontent.com/heroui-inc/heroui/refs/heads/v3/apps/docs/content/docs/en/react/components/(forms)/fieldset.mdx
> Group related form controls with legends, descriptions, and actions


## Usage

```tsx
import { Fieldset } from '@heroui/react';

```

```tsx
"use client";

import {FloppyDisk} from "@gravity-ui/icons";
import {
  Button,
  Description,
  FieldError,
  FieldGroup,
  Fieldset,
  Form,
  Input,
  Label,
  TextArea,
  TextField,
} from "@heroui/react";

export function Basic() {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};

    // Convert FormData to plain object
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    alert("Form submitted successfully!");
  };

  return (
    <Form className="w-full max-w-96" onSubmit={onSubmit}>
      <Fieldset>
        <Fieldset.Legend>Profile Settings</Fieldset.Legend>
        <Description>Update your profile information.</Description>
        <FieldGroup>
          <TextField
            isRequired
            name="name"
            validate={(value) => {
              if (value.length < 3) {
                return "Name must be at least 3 characters";
              }

              return null;
            }}
          >
            <Label>Name</Label>
            <Input placeholder="John Doe" />
            <FieldError />
          </TextField>
          <TextField isRequired name="email" type="email">
            <Label>Email</Label>
            <Input placeholder="john@example.com" />
            <FieldError />
          </TextField>
          <TextField
            isRequired
            name="bio"
            validate={(value) => {
              if (value.length < 10) {
                return "Bio must be at least 10 characters";
              }

              return null;
            }}
          >
            <Label>Bio</Label>
            <TextArea placeholder="Tell us about yourself..." />
            <Description>Minimum 10 characters</Description>
            <FieldError />
          </TextField>
        </FieldGroup>
        <Fieldset.Actions>
          <Button type="submit">
            <FloppyDisk />
            Save changes
          </Button>
          <Button type="reset" variant="secondary">
            Cancel
          </Button>
        </Fieldset.Actions>
      </Fieldset>
    </Form>
  );
}

```

## Anatomy

```tsx
import { Fieldset } from '@heroui/react';

export default () => (
  <Fieldset>
    <Fieldset.Legend />
    <Fieldset.Group>
      {/* form fields go here */}
    </Fieldset.Group>
    <Fieldset.Actions>
      {/* action buttons go here */}
    </Fieldset.Actions>
  </Fieldset>
)

```

## Examples

### In Surface

When used inside a [Surface](/docs/components/surface) component, use `variant="secondary"` on form controls (Input, TextArea, etc.) to apply the lower emphasis variant suitable for surface backgrounds.

```tsx
"use client";

import {FloppyDisk} from "@gravity-ui/icons";
import {
  Button,
  Description,
  FieldError,
  Fieldset,
  Form,
  Input,
  Label,
  Surface,
  TextArea,
  TextField,
} from "@heroui/react";
import React from "react";

export function OnSurface() {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};

    // Convert FormData to plain object
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    alert("Form submitted successfully!");
  };

  return (
    <div className="flex items-center justify-center rounded-3xl bg-surface p-6">
      <Surface className="w-full min-w-[380px]">
        <Form onSubmit={onSubmit}>
          <Fieldset className="w-full">
            <Fieldset.Legend>Profile Settings</Fieldset.Legend>
            <Description>Update your profile information.</Description>
            <Fieldset.Group>
              <TextField
                isRequired
                name="name"
                validate={(value) => {
                  if (value.length < 3) {
                    return "Name must be at least 3 characters";
                  }

                  return null;
                }}
              >
                <Label>Name</Label>
                <Input placeholder="John Doe" variant="secondary" />
                <FieldError />
              </TextField>
              <TextField isRequired name="email" type="email">
                <Label>Email</Label>
                <Input placeholder="john@example.com" variant="secondary" />
                <FieldError />
              </TextField>
              <TextField
                isRequired
                name="bio"
                validate={(value) => {
                  if (value.length < 10) {
                    return "Bio must be at least 10 characters";
                  }

                  return null;
                }}
              >
                <Label>Bio</Label>
                <TextArea placeholder="Tell us about yourself..." variant="secondary" />
                <Description>Minimum 10 characters</Description>
                <FieldError />
              </TextField>
            </Fieldset.Group>
            <Fieldset.Actions>
              <Button type="submit">
                <FloppyDisk />
                Save changes
              </Button>
              <Button type="reset" variant="tertiary">
                Cancel
              </Button>
            </Fieldset.Actions>
          </Fieldset>
        </Form>
      </Surface>
    </div>
  );
}

```

## Customization

### Tailwind CSS

```tsx
"use client";

import {FloppyDisk} from "@gravity-ui/icons";
import {
  Button,
  Description,
  FieldError,
  FieldGroup,
  Fieldset,
  Form,
  Input,
  Label,
  TextArea,
  TextField,
} from "@heroui/react";

const shell =
  "rounded-xl border border-border/70 bg-linear-to-b from-neutral-50/90 to-white p-4 ring-1 ring-black/5 dark:from-neutral-900/80 dark:to-neutral-900 dark:ring-white/10";

const field =
  "rounded-xl border border-border/80 bg-surface shadow-sm ring-1 ring-black/5 transition-[box-shadow,border-color] focus-visible:ring-2 focus-visible:ring-neutral-400/25 dark:ring-white/10 dark:focus-visible:ring-neutral-500/30";

export function CustomStyles() {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Form submitted successfully!");
  };

  return (
    <Form className="w-full max-w-96" onSubmit={onSubmit}>
      <Fieldset className={shell}>
        <Fieldset.Legend className="font-medium text-neutral-800 dark:text-neutral-100">
          Profile Settings
        </Fieldset.Legend>
        <Description className="text-neutral-600 dark:text-neutral-400">
          Update your profile information.
        </Description>
        <FieldGroup>
          <TextField
            isRequired
            name="name"
            validate={(value) => {
              if (value.length < 3) {
                return "Name must be at least 3 characters";
              }

              return null;
            }}
          >
            <Label>Name</Label>
            <Input className={field} placeholder="John Doe" />
            <FieldError />
          </TextField>
          <TextField isRequired name="email" type="email">
            <Label>Email</Label>
            <Input className={field} placeholder="john@example.com" />
            <FieldError />
          </TextField>
          <TextField
            isRequired
            name="bio"
            validate={(value) => {
              if (value.length < 10) {
                return "Bio must be at least 10 characters";
              }

              return null;
            }}
          >
            <Label>Bio</Label>
            <TextArea className={field} placeholder="Tell us about yourself..." />
            <Description>Minimum 10 characters</Description>
            <FieldError />
          </TextField>
        </FieldGroup>
        <Fieldset.Actions>
          <Button type="submit">
            <FloppyDisk />
            Save changes
          </Button>
          <Button type="reset" variant="secondary">
            Cancel
          </Button>
        </Fieldset.Actions>
      </Fieldset>
    </Form>
  );
}

```

### Global CSS

Use the `@layer components` directive to target Fieldset [BEM](https://getbem.com/)-style classes.

```css
@layer components {
  .fieldset {
    @apply gap-5 rounded-xl border border-border/60 bg-surface p-6 shadow-field;
  }

  .fieldset__legend {
    @apply text-lg font-semibold;
  }

  .fieldset__field-group {
    @apply gap-3 md:grid md:grid-cols-2;
  }

  .fieldset__actions {
    @apply flex justify-end gap-2 pt-2;
  }
}

```

## Styling Reference

HeroUI follows the [BEM](https://getbem.com/) methodology to ensure component variants and states are reusable and easy to customize.

### CSS Classes

The Fieldset compound component exposes these CSS selectors:

#### Base Classes \[!toc]

* `.fieldset` – Root container
* `.fieldset__legend` – Legend element
* `.fieldset__field-group` – Wrapper for grouped fields
* `.fieldset__actions` – Action bar below the fields

## API Reference

### Fieldset

| Prop          | Type                                        | Default                                         | Description                                               |
| ------------- | ------------------------------------------- | ----------------------------------------------- | --------------------------------------------------------- |
| `className`   | `string`                                    | -                                               | Tailwind CSS classes applied to the root element.         |
| `children`    | `React.ReactNode`                           | -                                               | Fieldset content (legend, groups, descriptions, actions). |
| `nativeProps` | `React.HTMLAttributes<HTMLFieldSetElement>` | Supports native fieldset attributes and events. |                                                           |

### Fieldset.Legend

| Prop          | Type                                      | Default | Description                              |
| ------------- | ----------------------------------------- | ------- | ---------------------------------------- |
| `className`   | `string`                                  | -       | Tailwind classes for the legend element. |
| `children`    | `React.ReactNode`                         | -       | Legend content, usually plain text.      |
| `nativeProps` | `React.HTMLAttributes<HTMLLegendElement>` | -       | Native legend attributes.                |

### Fieldset.Group

| Prop          | Type                                   | Default | Description                                    |
| ------------- | -------------------------------------- | ------- | ---------------------------------------------- |
| `className`   | `string`                               | -       | Layout and spacing classes for grouped fields. |
| `children`    | `React.ReactNode`                      | -       | Form controls to group inside the fieldset.    |
| `nativeProps` | `React.HTMLAttributes<HTMLDivElement>` | -       | Native div attributes.                         |

### Fieldset.Actions

| Prop          | Type                                   | Default | Description                                       |
| ------------- | -------------------------------------- | ------- | ------------------------------------------------- |
| `className`   | `string`                               | -       | Tailwind classes to align action buttons or text. |
| `children`    | `React.ReactNode`                      | -       | Action buttons or helper text.                    |
| `nativeProps` | `React.HTMLAttributes<HTMLDivElement>` | -       | Native div attributes.                            |

## Related Showcases



## Related Components

## Related Components

* **TextField**: Composition-friendly fields with labels and validation
* **Label**: Accessible label for form controls
* **CheckboxGroup**: Group of checkboxes with shared state

