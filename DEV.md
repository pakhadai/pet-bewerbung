# Режим розробки (Hot Reload)

## Запуск

```bash
npm run dev:docker
```

або

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

## Що це дає

- **Frontend**: Vite dev server на порту 3000 — зміни в `src/` відображаються миттєво без перезбірки
- **Backend**: nodemon — перезапуск при зміні `server/index.js`
- **Redis**: для rate limiting (AI)
- **Volumes**: код монтується з хоста, перезбірка Docker не потрібна

## Доступ через домен

1. Відкрийте Cloudflare Zero Trust → Tunnels → ваш tunnel
2. Public Hostname → Edit
3. Змініть **Service** з `http://frontend:80` на `http://frontend:3000`
4. Збережіть

Після цього https://pet.ohmyrevit.pp.ua буде показувати Vite dev server з hot reload.

Для повернення в production — змініть Service назад на `http://frontend:80` і запустіть звичайний `docker-compose up`.

## Локально (без Docker)

```bash
# Термінал 1: Redis (якщо потрібен)
docker run -d -p 6379:6379 redis:7-alpine

# Термінал 2: Backend
cd server && npm start

# Термінал 3: Frontend
npm run dev
```

Відкрийте http://localhost:3000
