# StudyX 📚

Платформа для онлайн-навчання (LMS) з повним циклом управління курсами, відстеженням прогресу студентів та системою перевірки завдань.

## 🛠️ Технології

**Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui  
**Backend:** Elysia, Bun, Supabase  
**Інфраструктура:** Turborepo, ESLint, Prettier

## 🚀 Швидкий старт

```bash
# Клонування
git clone https://github.com/Sasha125588/studyx
cd studyx-new

# Встановлення
bun install

# Запуск
bun run dev
```

**Команди:**

- `bun run dev` - запуск всіх застосунків
- `bun run dev:web` - тільки фронтенд (порт 3000)
- `bun run dev:api` - тільки API (порт 4000)
- `bun run build` - збірка проєкту

## ⚙️ Змінні оточення

### `apps/web/.env`

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

### `apps/api/.env`

```env
PORT=4001
API_PORT=4000
API_RAILWAY_URL=...
SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...
FRONTEND_RAILWAY_URL=...
FRONTEND_VERCEL_URL=...
```

## 🌐 Розгортання

- **Railway** - frontend + backend
- **Supabase** - база даних
