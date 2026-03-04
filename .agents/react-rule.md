# React Component Rules

Apply these rules to React components and hooks unless the user explicitly requests otherwise.

## File organization

- **One component per file.** Do not put multiple components in one file unless the user or requirements say otherwise.
- **React contexts:** Each React context (createContext + provider, etc.) must live in its **own file**. Do not define contexts inside component or hook files.
- **Custom hooks:** Each custom hook must live in its **own file**. Do not define hooks inside component files.

## File and component naming

- **Component name:** Use **PascalCase** (e.g. `Card`, `UserProfile`).
- **Component file name:** Must match the component name (e.g. `Card.tsx` for component `Card`).

## Custom hooks (file-level)

- **Hook name:** Use **camelCase** (e.g. `useAuth`, `useLocalStorage`).
- **Hook file name:** Must match the hook name (e.g. `useAuth.ts` for hook `useAuth`).
- **Hook shape:** Define the hook as a **function expression** (e.g. `const useAuth = () => { ... };`), not a function declaration, unless the user or requirements say otherwise.
- **Exports:** Export the hook both as a **named export** and as **default export** (e.g. `export const useAuth = ...` and `export default useAuth;`).

## Component exports

- **Named export:** Export the arrow function component as a named export (e.g. `export const Card = ...`).
- **Default export:** Also provide a default export of the same component (e.g. `export default Card;`).  
  Every component file must have both the named export and the default export.

## Component shape

- **Arrow function:** Define each component as an arrow function (e.g. `const ComponentName = (props) => { ... };`).
- **Single parameter:** The component function must have exactly one parameter: `props`. Do not destructure in the parameter list.
- **Destructure inside the body:** Destructure props inside the function body:  
  `const { propA, propB } = props;`

## Order inside a component

- **Hooks first:** All hook calls (useState, useEffect, custom hooks, etc.) must appear **above** any other function declarations or helper logic in the component.  
  Do not place hooks after local functions or after the main return.
- **Separate hooks from functions:** Leave **one blank line** between the last hook call and the first local function or helper below. Hooks and the code that follows them must not be back-to-back.

## Types

- **Placement:** Put type definitions at the **top of the file**, directly under the imports.
- **Prefer `type`:** Use `type` for component-related types (including props), not `interface`, unless the user or requirements say otherwise.
- **Props type name:** Name the component’s props type `{ComponentName}Props` (e.g. `ButtonProps` for `Button`).
- **Props export:** The main component's props type must be **exported** (e.g. `export type CardRootProps = ...`).
- **Spacing:** Separate each `type` or `interface` definition with **one blank line**.
- **Blank lines around definitions:** Every `type` or `interface` definition must have one empty line above and one empty line below it.

## Documentation and comments

- **JSDoc has priority:** When documentation is needed, prefer JSDoc over regular code comments (`//` or `/* ... */`).
- **Add docs only when needed:** Add JSDoc/comments only when explicitly requested by the user, or when the code contains complex logic or business logic.
- **Props links in JSDoc:** In JSDoc for props, prefer `{@link ...}` references to prop names instead of plain text.
- **English only:** Write JSDoc and code comments in English only.

## Compound components (dot notation)

- **Compound type:** A component that uses dot notation (e.g. `Card.Header`, `Card.Footer`) must have a dedicated **type** describing the compound shape (e.g. `CardComponent`).
- **Definition:** Define the compound as `Object.assign(RootComponent, { SubComponent1, SubComponent2, ... }) satisfies CompoundType`, and export it as the main component (e.g. `export const Card = Object.assign(CardRoot, { ... }) satisfies CardComponent`).
- **Sub-component exports:** Unless stated otherwise, sub-components of the compound may be exported as named exports (e.g. `CardRoot`, `CardHeader`, `CardTitle`, …) for direct use or composition.

## Imports

- **No gaps:** Do not add blank lines between import statements. Keep imports in a single block.

## JSX/TSX formatting

- **Sibling elements:** At the same nesting level, separate JSX/TSX elements with **one blank line** (e.g. between two sibling `<div>` or blocks).

## Hooks (usage in components)

- **Multiline hooks:** Separate multiline hook calls from each other with **one blank line**.
- **Single-line hooks:** Single-line hooks may stay back-to-back; blank lines between them are optional.

## Function spacing

- **Blank lines around functions:** Any function (component, hook, local helper, function declaration, or function expression) must have one empty line above and one empty line below it.

## Example (component)

```tsx
import { cn } from "@repo/ui";
import type { ReactNode } from "react";

type CardProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export const Card = (props: CardProps) => {
  const { title, children, className } = props;

  return (
    <div className={cn("rounded border", className)}>
      <h2>{title}</h2>

      {children}
    </div>
  );
};

export default Card;
```

## Example (compound component, dot notation)

```tsx
import { cn } from "@repo/ui";
import type { ReactNode } from "react";

export type CardRootProps = {
  children: ReactNode;
  className?: string;
};

type CardHeaderProps = {
  children: ReactNode;
  className?: string;
};

type CardContentProps = {
  children: ReactNode;
  className?: string;
};

type CardComponent = typeof CardRoot & {
  Header: typeof CardHeader;
  Content: typeof CardContent;
};

const CardRoot = (props: CardRootProps) => {
  const { children, className } = props;
  return <div className={cn("rounded-lg border p-4", className)}>{children}</div>;
};

const CardHeader = (props: CardHeaderProps) => {
  const { children, className } = props;
  return <div className={cn("mb-2", className)}>{children}</div>;
};

const CardContent = (props: CardContentProps) => {
  const { children, className } = props;
  return <div className={cn("text-sm", className)}>{children}</div>;
};

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Content: CardContent,
}) satisfies CardComponent;

export { CardRoot, CardHeader, CardContent };
export default Card;
```

## Example (custom hook)

```ts
import { useState } from "react";

export const useToggle = (initial = false) => {
  const [value, setValue] = useState(initial);

  const toggle = () => setValue((v) => !v);

  return [value, toggle] as const;
};

export default useToggle;
```
