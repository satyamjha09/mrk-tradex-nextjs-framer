# E-Commerce App Integration

This folder contains the imported full-stack e-commerce project inside the MRK Tradex repository.

## Structure

- `apps/ecommerce/client` - Next.js e-commerce frontend
- `apps/ecommerce/server` - Express, Prisma, GraphQL API server
- `apps/ecommerce/docs` - Imported project documentation
- `apps/ecommerce/collections` - Imported API/client collections

## Root Commands

Run these from the repository root:

```bash
npm run ecom:install
npm run ecom:dev:client
npm run ecom:dev:server
```

The MRK homepage "Explore all" buttons open the shop at `http://localhost:3001/shop` by default. To use a different hosted shop URL, set `NEXT_PUBLIC_ECOMMERCE_URL`.

The e-commerce app keeps its own `package.json`, lockfiles, and TypeScript config so it does not interfere with the MRK homepage build.

Before starting the server, create a local environment file from the server example and add the required database, Redis, Stripe, and auth values:

```bash
copy apps\ecommerce\server\.env.example apps\ecommerce\server\.env
```
