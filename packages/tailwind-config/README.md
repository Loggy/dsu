# DSU Design System

Shared Tailwind configuration and base styles for all DSU applications.

## Structure

- **`index.js`** - Tailwind config with colors, typography, spacing, animations
- **`base.css`** - Shared base styles and components
- **`package.json`** - Package definition with Tailwind plugins

## Usage

### 1. In Tailwind Config

**Simple app (landing):**

```js
// apps/landing/tailwind.config.js
module.exports = {
  ...require("@dsu/tailwind-config"),
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // ... your content paths
  ],
  plugins: [
    ...require("@dsu/tailwind-config").plugins,
    // Add app-specific plugins
  ],
};
```

**Dashboard app with shadcn/ui:**

```js
// apps/app/tailwind.config.js
module.exports = {
  ...require("@dsu/tailwind-config"),
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    ...require("@dsu/tailwind-config").theme,
    extend: {
      ...require("@dsu/tailwind-config").theme.extend,
      // shadcn/ui overrides
      colors: {
        ...require("@dsu/tailwind-config").theme.extend.colors,
        border: "hsl(var(--border))",
        // ... other shadcn colors
      },
    },
  },
};
```

### 2. In Global CSS

```css
/* Import shared base styles */
@import "@dsu/tailwind-config/base.css";

/* Add app-specific overrides */
@layer base {
  body {
    @apply bg-custom-color;
  }
}
```

## What's Included

### Colors

- Primary palette: `deep-ocean`, `electric-teal`, `sage-green`
- Secondary palette: `cloud-white`, `slate-gray`, `midnight`
- Functional: `moss-green`, `amber`, `coral`

### Components

- Buttons: `.btn-primary`, `.btn-secondary`, `.btn-ghost`
- Cards: `.card`, `.card-hover`
- Forms: `.input`, `.label`, `.input-helper`
- Effects: `.glass`, `.text-gradient`, `.skeleton`

### Utilities

- Spacing: `.space-tight` → `.space-extra`
- Effects: `.hover-lift`, `.skip-to-content`

## File Sizes

**Before unification:**

- Landing globals.css: 286 lines
- App globals.css: 400 lines
- **Total: 686 lines**

**After unification:**

- Shared base.css: 158 lines
- Landing globals.css: 100 lines
- App globals.css: 274 lines
- **Total: 532 lines** (22% reduction)

All common styles are now shared, reducing duplication and maintenance overhead.
