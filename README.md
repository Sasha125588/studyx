# StudyX

## Структура проєкту

```
studyx/
├── apps/
│   ├── web/          # Next.js застосунок (фронтенд)
│   └── api/          # Elysia API (бекенд)
├── packages/
│   └── config/       # Спільні конфігурації
│       ├── eslint/
│       ├── typescript/
├── turbo.json        # Конфігурація Turborepo
└── package.json      # Root workspace
```

## Встановлення

```bash
bun install
```

## Розробка

### Запустити всі застосунки

```bash
bun run dev
```

### Запустити окремі застосунки

```bash
# Тільки фронтенд
bun run dev:web

# Тільки API
bun run dev:api
```

## Збірка

```bash
# Зібрати все
bun run build

# Зібрати окремо
bun run build:web
bun run build:api
```

## Застосунки

### Web (apps/web)

Next.js 16 застосунок на порту 3000.

- **Dev:** `cd apps/web && bun run dev`
- **Build:** `cd apps/web && bun run build`

### API (apps/api)

Standalone Elysia API сервер на порту 4000.

- **Dev:** `cd apps/api && bun run dev`
- **Build:** `cd apps/api && bun run build`

## Пакети

### Config (packages/config)

Спільні конфігурації для всіх застосунків:

- **ESLint** - правила лінтингу
- **TypeScript** - базові tsconfig

## Скрипти

- `bun run dev` - запустити всі застосунки в dev режимі
- `bun run build` - зібрати всі застосунки
- `bun run lint` - перевірити код лінтером
- `bun run type-check` - перевірити типи TypeScript
- `bun run clean` - очистити всі build артефакти
- `bun run format` - відформатувати код

## Змінні оточення

### Web App

Створіть `apps/web/.env`:

```env
NEXT_PUBLIC_FRONTEND_VERCEL_URL=...
NEXT_PUBLIC_FRONTEND_RAILWAY_URL=...
NEXT_PUBLIC_API_RAILWAY_URL=...
NEXT_PUBLIC_DATABASE_URL=...
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=...
NEXT_PUBLIC_GITHUB_CLIENT_ID=...
NEXT_PUBLIC_GITHUB_CLIENT_SECRET=...
BETTER_AUTH_SECRET=...
```

### API

Створіть `apps/api/.env`:

```env
PORT=4001
API_PORT=4000
API_RAILWAY_URL=...
FRONTEND_VERCEL_URL=...
FRONTEND_RAILWAY_URL=...
SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...
```

## Технології

- **Turborepo** - система збірки монорепозиторію
- **Bun** - пакетний менеджер та рантайм
- **Next.js 16** - React фреймворк
- **Elysia** - TypeScript веб-фреймворк
- **Better Auth** - автентифікація
- **Supabase** - база даних
- **Tailwind CSS** - стилізація
