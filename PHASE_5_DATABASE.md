# Phase 5: Database + Real MRK Seed

Phase 5 moves the imported ecommerce API from demo/placeholder mode to real PostgreSQL-backed catalogue data.

## What Was Added

- Project-local PostgreSQL compose file: `apps/ecommerce/server/docker-compose.yml`
- MRK-specific database seed: `apps/ecommerce/server/seeds/mrk-seed.ts`
- Root database scripts:
  - `npm run db:up`
  - `npm run db:down`
  - `npm run db:migrate`
  - `npm run api:seed`

## Local Database

The project database uses port `5433` so it does not conflict with the existing PostgreSQL service already running on this machine at port `5432`.

```env
DATABASE_URL=postgresql://mrk:mrk_local_password@localhost:5433/mrk_tradex?schema=public
```

## Run Order

Start Docker Desktop first, then run:

```bash
npm run db:up
npm run api:prisma -- generate
npm run db:migrate
npm run api:seed
```

After the seed succeeds, update `apps/ecommerce/server/.env`:

```env
SKIP_DB_CONNECT=false
```

Then update the main app `.env.local` when you want live API catalogue data:

```env
NEXT_PUBLIC_USE_DEMO_CATALOG=false
```

## Seeded Accounts

All accounts use password `password123`.

- `superadmin@example.com`
- `admin@example.com`
- `user@example.com`

## Seeded Catalogue

- MRG Auto-Timer Starter
- WLC Smart Plug
- MRX-HD Three-Phase Digital Starter Panel
- MRK Panel Accessory Kit

## Current Machine Note

Docker Desktop is installed, but its Windows service is currently stopped and could not be started from this Codex session. The existing PostgreSQL service on `5432` is running, but it rejects the placeholder `postgres` password. Once Docker Desktop is started manually, the commands above should create and seed the local project database.
