# OrderDesk

Админка заказов: CRUD, статусы, статистика.

**Стек:** PHP 8 REST + SQLite, React + TypeScript + Vite

## Функции

- заказы: клиент, товар, сумма, статус
- статусы: `new` / `paid` / `shipped` / `cancelled`
- статистика: кол-во, выручка, оплаченные

## Прокси

`frontend/vite.config.ts`:

```ts
proxy: { '/api': 'http://127.0.0.1:8080' }
```

`/api/*` с фронта → PHP на `:8080`.

## Запуск

```bash
# backend
cd api
php -S 127.0.0.1:8080 router.php

# frontend (второй терминал)
cd frontend
npm install
npm run dev
```

Открыть URL из вывода Vite (`Local:`), обычно `http://127.0.0.1:5173`.

## API

| Метод | Путь |
|-------|------|
| GET | `/api/orders` |
| POST | `/api/orders` |
| PATCH | `/api/orders/{id}` |
| DELETE | `/api/orders/{id}` |
| GET | `/api/stats` |
