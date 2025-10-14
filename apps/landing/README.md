# DSU Landing Page

The landing page for Decentralized Stable Units (DSU) - a DeFi savings platform with risk-adjusted tranches.

## Overview

This landing page showcases the DSU platform, featuring:

- **Hero Section**: Main value proposition and CTA
- **Features Section**: Detailed explanation of TDSU (Tempered DSU) and CDSU (Chasing DSU) tranches
- **CTA Section**: Secondary call-to-action
- **Footer**: Navigation and links

## Design System

The landing page follows the design system defined in `/docs/DESIGN_CONCEPT.md`:

### Colors

- **Deep Ocean Blue** (`#0A2540`): Primary brand color
- **Electric Teal** (`#00D9C0`): Accent and CTA buttons
- **Sage Green** (`#5FB97C`): Success states
- **Cloud White** (`#F8FAFB`): Backgrounds
- **Slate Gray** (`#64748B`): Body text
- **Midnight** (`#1E293B`): Headlines

### Typography

- **Font Family**: Inter (body), Space Grotesk (display/headlines)
- **Type Scale**: 12px (caption) to 72px (hero)

### Components

All components follow the soft neumorphism meets clean minimalism aesthetic with:

- Rounded corners (8-16px)
- Subtle shadows and depth
- Smooth transitions and hover effects
- Frosted glass effects for header

## Running Locally

```bash
# Install dependencies (from monorepo root)
pnpm install

# Run development server
cd apps/landing
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

The landing page runs on port **3003** by default.

## Project Structure

```
apps/landing/
├── app/
│   ├── globals.css           # Global styles with theme support
│   ├── layout.tsx            # Root layout with fonts & ThemeProvider
│   └── page.tsx              # Main landing page
├── components/
│   ├── header.tsx            # Sticky header with theme toggle
│   ├── hero.tsx              # Hero section with CTA
│   ├── features.tsx          # TDSU/CDSU features cards
│   ├── cta-section.tsx       # Secondary CTA block
│   ├── footer.tsx            # Footer with links
│   ├── theme-provider.tsx    # Theme context wrapper
│   └── theme-toggle.tsx      # Dark/light mode toggle button
├── README.md                 # This file
└── THEMING.md                # Theme implementation guide
```

## Key Features

### Dark/Light Theme 🌙☀️

- **System Detection**: Automatically matches OS theme preference
- **Manual Toggle**: Sun/Moon icon button in header
- **Smooth Transitions**: 200ms color transitions
- **Persistent**: Remembers user preference
- See [THEMING.md](./THEMING.md) for full details

### Header

- Sticky navigation with frosted glass effect
- Logo, Docs, X (Twitter), Theme Toggle, and "Open App" CTA
- Mobile-responsive hamburger menu

### Hero Section

- Gradient background with decorative elements
- Main headline: "Decentralized Stable Units"
- Slogan: "DeFi Savings buddy maximizing yield, adjusting risks"
- Primary CTA: "Earn with DSU"
- Quick stats showing tranche characteristics

### Features Section

Two feature cards explaining the tranches:

**Tempered DSU ($TDSU)** - Senior Tranche:

- Lower risk/reward profile (0-35% of protocol profit/losses)
- Covers 35% of liquidation losses
- Stable returns with capped exposure

**Chasing DSU ($CDSU)** - Junior Tranche:

- Higher risk/reward profile (65% of protocol earnings)
- First loss coverage (negative funding periods, liquidation losses)
- Maximum upside potential

### CTA Section

- Secondary conversion opportunity
- Reinforces value proposition
- Links to app

### Footer

- Logo and branding
- Links to Docs, X, Terms
- Copyright notice

## Dependencies

- **Next.js 14**: React framework
- **Tailwind CSS**: Utility-first CSS
- **Lucide React**: Icon library (Moon, Sun, ArrowRight, etc.)
- **next-themes**: Dark/light theme management
- **@dsu/tailwind-config**: Shared design system

## Typography Setup

The page uses Google Fonts loaded via Next.js font optimization:

- Inter: Body text and UI elements
- Space Grotesk: Headlines and display text

Fonts are loaded with `display: swap` for optimal performance.

## Responsive Design

The landing page is fully responsive with breakpoints at:

- **Mobile**: 320px - 768px (single column, touch-friendly)
- **Tablet**: 768px - 1024px (2-column layouts)
- **Desktop**: 1024px+ (full grid system)

## Performance

Following Next.js best practices:

- Server-side rendering
- Optimized Google Fonts loading
- Minimal client-side JavaScript
- Optimized images (when added)
- Tree-shaken CSS via Tailwind

## Customization

To customize content:

1. Edit component text in `/components/*.tsx`
2. Update colors in shared config: `/packages/tailwind-config/index.js`
3. Modify metadata in `/app/layout.tsx`

## Links

Update these placeholder links:

- `/docs` - Documentation site
- `/app` - Main application
- `/terms` - Terms of service
- `https://x.com/dsu` - Twitter/X profile

## Future Enhancements

Potential additions:

- FAQ accordion section
- Interactive APY calculator
- Real-time TVL/stats integration
- Newsletter signup form
- User testimonials
- Security audit badges
- Blog/updates section
