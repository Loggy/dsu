# DSU

Decentralized Stable Units

## Project Structure

This is a monorepo using pnpm workspaces containing:

- `apps/api`: NestJS backend API
- `apps/app`: Next.js main application
- `apps/landing`: Next.js marketing site
- `packages/tailwind-config`: Shared Tailwind CSS configuration
- `packages/typescript-config`: Shared TypeScript configuration
- `packages/eslint-config`: Shared ESLint configuration

## Tech Stack

### Backend (API)
- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- Resend (Email)

### Frontend (App & Landing)
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Radix UI
- React Query

## Getting Started

### Prerequisites

- Node.js (v18+)
- PNPM (v8+)
- PostgreSQL

### Installation

```bash
# Install dependencies
pnpm install

# Setup environment variables
cp apps/api/.env.example apps/api/.env
cp apps/app/.env.example apps/app/.env
cp apps/landing/.env.example apps/landing/.env

# Start development
pnpm dev
```

## Development

- API: http://localhost:3001
- App: http://localhost:3000
- Landing: http://localhost:3002

## Commands

```bash
# Run all apps in development mode
pnpm dev

# Build all apps
pnpm build

# Lint all apps
pnpm lint

# Type check all apps
pnpm typecheck
```

## License

Private 