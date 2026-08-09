# Full-Stack E-Commerce Platform

Single-store e-commerce app with a Next.js storefront, Express API, Prisma/PostgreSQL, Stripe checkout, admin dashboard, and chat.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Demo-Live-0070f3)](https://open-source-ecommerce.abdalrahman-aboalkhair.work)
[![YouTube Walkthrough](https://img.shields.io/badge/Video-Walkthrough-red?logo=youtube)](https://www.youtube.com/watch?v=qJDXcQ_sxSI)

![Storefront homepage](assets/screenshots/homepage.png)

## What Changed For This Fork

- Docker support was removed from the repo.
- The Next.js client is ready for Vercel from `src/client`.
- The Express backend runs as a normal Node service without Docker.
- Redis is optional for local development. If `REDIS_URL` is missing, the server uses in-memory sessions/cache. Use real Redis in production.
- The signup OAuth URL now uses the shared API base config.

## Project Layout

```text
src/
  client/  Next.js frontend for Vercel
  server/  Express API + Prisma backend
```

## Vercel Frontend Deployment

Create a Vercel project from this repository and set:

| Setting | Value |
| --- | --- |
| Root Directory | `src/client` |
| Framework Preset | Next.js |
| Install Command | `npm ci` |
| Build Command | `npm run build` |

The client contains `src/client/vercel.json` with the same install/build commands.

### Demo-Only Vercel Deployment

Use this when you want the site live without API, database, Redis, or payment keys:

```env
NEXT_PUBLIC_DEMO_MODE=true
```

Demo accounts, any password:

| Role | Email |
| --- | --- |
| Customer | `user@example.com` |
| Admin | `admin@example.com` |
| Superadmin | `superadmin@example.com` |

### Full Backend Deployment

For real auth, cart persistence, checkout, admin data, and chat, deploy the backend separately on a Node host such as Render, Railway, Fly.io, a VPS, or another service that supports long-running Node servers.

Set these Vercel client env vars:

```env
NEXT_PUBLIC_API_URL_PROD=https://your-api-domain.com/api/v1
NEXT_PUBLIC_SOCKET_URL=https://your-api-domain.com
```

Set these backend env vars on your API host:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
REDIS_URL=redis://HOST:PORT
NODE_ENV=production
PORT=5000
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
CLIENT_URL_PROD=https://your-vercel-app.vercel.app
ACCESS_TOKEN_SECRET=change-me
REFRESH_TOKEN_SECRET=change-me
SESSION_SECRET=change-me
COOKIE_SECRET=change-me
```

Also add Stripe, Cloudinary, OAuth, and SMTP keys when you need those features. See `src/server/.env.example`.

## Local Setup Without Docker

Prerequisites:

- Node.js 18+
- npm
- PostgreSQL
- Git
- Redis is optional for local development

Install dependencies:

```bash
npm run install:all
```

Create env files:

```bash
cp src/server/.env.example src/server/.env
cp src/client/.env.example src/client/.env.local
```

For a fast frontend-only run, put this in `src/client/.env.local`:

```env
NEXT_PUBLIC_DEMO_MODE=true
```

Then start the client:

```bash
npm run dev:client
```

Open http://localhost:3000.

For full local backend:

1. Create a local PostgreSQL database.
2. Set `DATABASE_URL` in `src/server/.env`.
3. Optionally set `REDIS_URL`; if you skip it, memory cache is used.
4. Run:

```bash
cd src/server
npx prisma migrate dev
npm run seed
npm run dev
```

In another terminal:

```bash
npm run dev:client
```

## Useful Scripts

```bash
npm run install:all
npm run dev:client
npm run dev:server
npm run build:client
npm run build:server
npm run vercel-build
```

## Test Accounts After Seeding

| Role | Email | Password |
| --- | --- | --- |
| Superadmin | `superadmin@example.com` | `password123` |
| Admin | `admin@example.com` | `password123` |
| User | `user@example.com` | `password123` |

## Screenshots

### Storefront

| Home | Product detail |
| --- | --- |
| ![Homepage](assets/screenshots/homepage.png) | ![Product detail](assets/screenshots/product_detail.png) |

| Cart | Checkout |
| --- | --- |
| ![Cart](assets/screenshots/cart.png) | ![Payment](assets/screenshots/payment.png) |

### Admin Dashboard

| Overview | Products |
| --- | --- |
| ![Dashboard overview](assets/screenshots/dashboard_overview.png) | ![Products dashboard](assets/screenshots/products_dashboard.png) |

| Analytics | Inventory |
| --- | --- |
| ![Analytics](assets/screenshots/analytics_dashboard.png) | ![Inventory](assets/screenshots/inventory_dashboard.png) |

## License

MIT. See [LICENSE](LICENSE).
