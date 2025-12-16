# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Repo overview

This is a Turborepo + Bun monorepo:

- `apps/web`: Next.js app (App Router)
- `apps/api`: Elysia API server
- `packages/database`: generated Supabase DB types + convenience entity types
- `packages/config`: shared ESLint + TypeScript configs

## Common commands

All commands below are intended to be run from the repo root unless noted.

### Install

- `bun install`

### Dev (run locally)

- Run everything (via Turborepo): `bun run dev`
- Web only: `bun run dev:web`
- API only: `bun run dev:api`

### Build

- Build everything: `bun run build`
- Build web only: `bun run build:web`
- Build API only: `bun run build:api`

Notes:

- `bun run build:full` builds the API first, starts it briefly, then builds the web app (useful when the web build needs the API reachable).

### Start (production-like)

- Start both (kills anything on :3000/:4000 first): `bun run start`
- Start web only: `bun run start:web`
- Start API only: `bun run start:api`

### Lint / format / types

- Lint all (Turborepo): `bun run lint`
- Typecheck all (Turborepo): `bun run type-check`
- Format (Prettier): `bun run format`

Targeting a single app with Turborepo filtering:

- Example: `bun run lint -- --filter=web`
- Example: `bun run type-check -- --filter=api`

### Tests

A test runner is not currently wired up at the root (there is no `test` script in `package.json`).
`turbo.json` defines a `test` pipeline task, so if/when per-package `test` scripts are added, they can be run with `turbo run test` and filtered similarly.

### DB type generation

- Generate Supabase types into `packages/database/src/types.ts`:
  - `bun run generate-db-types`

## Key environment files

(From `README.md`)

- Web: `apps/web/.env`
- API: `apps/api/.env`

## Code architecture (big picture)

### Web app (`apps/web`): Next.js App Router

Primary entrypoints and conventions:

- Route groups:
  - `apps/web/src/app/(auth)/*` for login/signup pages
  - `apps/web/src/app/(private)/*` for authenticated pages
- Server Actions live alongside routes (example): `apps/web/src/app/(auth)/(actions)/*`.
- Data fetching commonly goes through typed API wrappers under:
  - `apps/web/src/shared/api/requests/*`

#### Typed API client (Elysia Eden)

- `apps/web/src/lib/elysia/client.ts` creates an Eden Treaty client typed against the API app type `App`.
- `apps/web/tsconfig.json` maps `@api` to `../api/src/index.ts` so the web app can import the API type at build/typecheck time.
- Request wrappers like `getCourses()` / `getCoursesWithDetails()` call `api.courses...` and normalize `{ data, error }`.
- Some requests opt into Next.js caching via `'use cache'` + `cacheLife('minutes')`.

#### Auth (Better Auth)

Auth is implemented with Better Auth:

- Web server-side usage: `apps/web/src/lib/better-auth/server.ts` (includes the `nextCookies()` plugin).
- Web client-side usage: `apps/web/src/lib/better-auth/client.ts` (`createAuthClient`, exported helpers like `signIn`, `useSession`).
- Server actions call `auth.api.signInEmail` / `auth.api.signUpEmail` (see `apps/web/src/app/(auth)/(actions)/*`).
- Authenticated server components often read the session via `auth.api.getSession({ headers: await headers() })` (see `getUser`).

#### Locale / i18n

- Locale is stored in a `locale` cookie (set via `apps/web/src/shared/helpers/i18n/setLocale.ts`).
- Root layout (`apps/web/src/app/layout.tsx`) reads an `x-locale` request header and loads messages from `locales/<locale>.json` via `getMessagesByLocale`.
- There is middleware-like logic in `apps/web/src/proxy.ts` that:
  - redirects between `/login` and protected pages based on the Better Auth session cookie
  - sets the `x-locale` header on the response
  - exports a `config.matcher`
    If locale/auth redirects aren’t working, verify this logic is actually wired as Next.js middleware (Next expects a `middleware.ts` entrypoint).

#### Supabase clients

- Server (SSR) client: `apps/web/src/lib/supabase/server.ts` (uses `@supabase/ssr` + Next cookies)
- Browser client: `apps/web/src/lib/supabase/client.ts`

### API app (`apps/api`): Elysia server

- Entrypoint: `apps/api/src/index.ts`
- Routes are assembled via `.use(...)` modules, and Better Auth is mounted at:
  - `/auth/*` via `auth.handler(request)`
- Feature modules:
  - Auth: `apps/api/src/modules/auth/index.ts`
  - Courses: `apps/api/src/modules/courses/index.ts` (queries Supabase and returns nested course/module/lesson structures)
- Supabase client:
  - `apps/api/src/lib/supabase.ts` uses the Supabase service key and is typed with `@studyx/database`.

### Shared database types (`packages/database`)

- `packages/database/src/types.ts` is the generated Supabase type surface (source of truth for table/enum types).
- `packages/database/src/entities.ts` defines convenience aliases (e.g. `Course`, `Module`, plus nested “with details” shapes).
- Both `apps/web` and `apps/api` depend on this package for consistent typing.

## Linting/formatting conventions that affect editing

- ESLint rules disallow `function` declarations/expressions in most code (`func-style`, `prefer-arrow-callback`, `no-restricted-syntax`), so prefer arrow functions.
- Some folders are exempted (UI/vendor-like code under `src/components/animate-ui`, `src/components/ui`, and `src/lib`).
- Prettier is configured to sort imports (see `.prettierrc` for import order groups).
