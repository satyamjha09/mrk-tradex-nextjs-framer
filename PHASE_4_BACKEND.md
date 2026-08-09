# Phase 4: Backend API Wiring

The imported ecommerce backend now lives inside the main MRK project at `apps/ecommerce/server`.

## Local URLs

- Main site: `http://localhost:3000`
- API server: `http://localhost:5000`
- REST API: `http://localhost:5000/api/v1`
- GraphQL: `http://localhost:5000/api/v1/graphql`
- Swagger: `http://localhost:5000/api-docs`

## Commands

```bash
npm run api:install
npm run api:dev
npm run api:build
npm run api:prisma -- generate
npm run api:seed
```

## Environment

Copy `.env.example` to `.env.local` for the main Next app.

Copy `apps/ecommerce/server/.env.local.example` to `apps/ecommerce/server/.env` for the API server, then replace `DATABASE_URL` with a real PostgreSQL database before running migrations or seed data.

Until PostgreSQL is configured, keep `SKIP_DB_CONNECT=true` for API boot checks and keep `NEXT_PUBLIC_USE_DEMO_CATALOG=true` so the storefront can still show products while the backend is being prepared. After PostgreSQL is ready, set `SKIP_DB_CONNECT=false`, then run migrations and seed data. Replace the placeholder Stripe and OAuth keys before testing real payments or social login.
