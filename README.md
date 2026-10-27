# OrderDesk

Mini order admin panel (pet project).

**Stack:** React + TypeScript + Vite · PHP 8 REST API · SQLite

## Features

- create / update / delete orders
- status workflow: `new` → `paid` → `shipped` / `cancelled`
- dashboard stats (orders, revenue, paid count)

## Run locally

```bash
# API
cd api
php -S 127.0.0.1:8080 router.php

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Open http://localhost:5174

## API

- `GET /api/orders`
- `POST /api/orders`
- `PATCH /api/orders/{id}`
- `DELETE /api/orders/{id}`
- `GET /api/stats`
