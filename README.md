# OrderDesk

Мини-админка заказов: создать заказ, сменить статус, смотреть выручку. Pet-project на React + PHP.

Подходит как демо «простая операционка / складской учёт» без тяжёлого фреймворка на backend.

## Стек

| Слой | Технологии |
|------|------------|
| Backend | PHP 8, свой REST API, SQLite |
| Frontend | React, TypeScript, Vite |
| Хранение | SQLite-файл в `api/storage/` |

## Что умеет

- CRUD заказов (клиент, товар, сумма, статус)
- статусы: `new` → `paid` → `shipped` / `cancelled`
- статистика: число заказов, выручка, сколько оплачено
- смена статуса прямо из списка

## Как устроен прокси

Vite проксирует `/api` на PHP-сервер:

```
браузер → http://127.0.0.1:5173/api/...
              ↓ (vite proxy)
         http://127.0.0.1:8080/api/...
```

Настройка в `frontend/vite.config.ts`:

```ts
proxy: { '/api': 'http://127.0.0.1:8080' }
```

Backend запускай на **порту 8080**.

## Запуск

Нужны: PHP 8+, Node.js 18+.

**1. Backend** (из корня репозитория):

```bash
cd api
php -S 127.0.0.1:8080 router.php
```

API: `http://127.0.0.1:8080`

**2. Frontend** (второй терминал):

```bash
cd frontend
npm install
npm run dev
```

**3. Открыть в браузере**

URL смотри в выводе Vite. Обычно:

```
http://127.0.0.1:5173/
```

Если порт занят — Vite покажет другой (`5174`, `5175`…). Открывай тот, что в `Local:`.

## API

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/orders` | список заказов |
| POST | `/api/orders` | создать |
| PATCH | `/api/orders/{id}` | обновить (в т.ч. статус) |
| DELETE | `/api/orders/{id}` | удалить |
| GET | `/api/stats` | агрегаты |

## Структура

```
orderdesk/
  api/
    public/index.php
    router.php          # точка входа для php -S
    src/                # Database, OrderRepository
    storage/            # SQLite
  frontend/             # React
```
