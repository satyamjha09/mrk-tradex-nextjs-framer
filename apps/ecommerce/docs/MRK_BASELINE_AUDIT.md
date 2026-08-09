# MRK Baseline Audit

Audit date: 2026-08-03

Branch: `feat/mrk-tradex-rebuild`

Repository: `Abdelrahman-Aboalkhair/Full-Stack-E-Commerce-Platform`

Purpose: record the current state before continuing the MRK Tradex Pvt Ltd rebuild.

Important baseline note: this audit reflects the working tree as found during this phase. The tree already contains local changes, including initial MRK-oriented files and deleted Docker files. Those changes were preserved and not reset.

## 1. Safety State

Current branch was created from `main`:

```bash
git switch -c feat/mrk-tradex-rebuild
```

The working tree was dirty before branch creation. No local changes were discarded, reset, or overwritten.

Local env files:

| File | Result |
| --- | --- |
| `src/.env` | Created from `src/.env.example` because missing |
| `src/server/.env` | Created from `src/server/.env.example` because missing |
| `src/client/.env.local` | Already existed; left untouched |

Secret values were not printed.

Unsafe operations avoided:

- Did not run `docker compose down -v`.
- Did not delete database volumes.
- Did not reset Git history.
- Did not run Prisma migrations or seed because no real database URL is configured.

## 2. Tooling

| Command | Result |
| --- | --- |
| `git branch --show-current` | `main` before branch creation; then `feat/mrk-tradex-rebuild` |
| `node --version` | `v22.22.0` |
| `npm.cmd --version` | `10.9.4` |
| `docker --version` | Docker available: `29.6.2` |
| `docker compose version` | Docker Compose available: `v5.3.1` |

Docker status: Docker is installed, but no compose file is currently available in the working tree. `src/docker-compose.yml` is deleted in local changes, so Docker Compose was not used.

## 3. Current Architecture

Root project scripts delegate to client and server workspaces.

Frontend:

- Location: `src/client`
- Framework: Next.js App Router
- Main dependencies: React 19, Next.js 15, Redux Toolkit, RTK Query, Apollo Client, Socket.IO client, Stripe JS, Tailwind CSS, Framer Motion
- API config: `src/client/app/lib/constants/config.ts`
- Global providers: Redux, Apollo, auth provider, loading bar, toast
- Demo mode exists through `NEXT_PUBLIC_DEMO_MODE=true`

Backend:

- Location: `src/server`
- Runtime: Express + TypeScript
- Database: Prisma + PostgreSQL
- Cache/session: Redis when `REDIS_URL` exists; in-memory fallback when missing
- Payments: Stripe
- Uploads: Multer memory storage + Cloudinary
- Auth: JWT cookies, sessions, Passport social OAuth
- Docs: Swagger UI at `/api-docs`
- GraphQL: Apollo Server at `/api/v1/graphql`
- Realtime: Socket.IO for chat and WebRTC signaling

## 4. Frontend Route List

Current page routes:

| Page file | Route |
| --- | --- |
| `app/page.tsx` | `/` |
| `app/(auth)/password-reset/page.tsx` | `/password-reset` |
| `app/(auth)/password-reset/[token]/page.tsx` | `/password-reset/[token]` |
| `app/(auth)/sign-in/page.tsx` | `/sign-in` |
| `app/(auth)/sign-up/page.tsx` | `/sign-up` |
| `app/(private)/(payment)/cancel/page.tsx` | `/cancel` |
| `app/(private)/(payment)/failure/page.tsx` | `/failure` |
| `app/(private)/(payment)/payment-success/page.tsx` | `/payment-success` |
| `app/(private)/(user)/orders/page.tsx` | `/orders` |
| `app/(private)/(user)/orders/[orderId]/page.tsx` | `/orders/[orderId]` |
| `app/(private)/(user)/profile/page.tsx` | `/profile` |
| `app/(private)/dashboard/page.tsx` | `/dashboard` |
| `app/(private)/dashboard/analytics/page.tsx` | `/dashboard/analytics` |
| `app/(private)/dashboard/attributes/page.tsx` | `/dashboard/attributes` |
| `app/(private)/dashboard/categories/page.tsx` | `/dashboard/categories` |
| `app/(private)/dashboard/chats/page.tsx` | `/dashboard/chats` |
| `app/(private)/dashboard/inventory/page.tsx` | `/dashboard/inventory` |
| `app/(private)/dashboard/logs/page.tsx` | `/dashboard/logs` |
| `app/(private)/dashboard/logs/[logId]/page.tsx` | `/dashboard/logs/[logId]` |
| `app/(private)/dashboard/products/page.tsx` | `/dashboard/products` |
| `app/(private)/dashboard/products/[id]/page.tsx` | `/dashboard/products/[id]` |
| `app/(private)/dashboard/reports/page.tsx` | `/dashboard/reports` |
| `app/(private)/dashboard/transactions/page.tsx` | `/dashboard/transactions` |
| `app/(private)/dashboard/users/page.tsx` | `/dashboard/users` |
| `app/(private)/support/page.tsx` | `/support` |
| `app/(public)/cart/page.tsx` | `/cart` |
| `app/(public)/contact/page.tsx` | `/contact` |
| `app/(public)/dealer/page.tsx` | `/dealer` |
| `app/(public)/product/[slug]/page.tsx` | `/product/[slug]` |
| `app/(public)/shop/page.tsx` | `/shop` |
| `app/(public)/success/page.tsx` | `/success` |
| `app/maintenance/page.tsx` | `/maintenance` |

## 5. Backend API Route List

Top-level backend mounts:

| Mount | Source |
| --- | --- |
| `/health`, `/health/detailed`, `/ready`, `/live` | `src/server/src/routes/health.routes.ts` |
| `/api/v1/webhook` | `src/server/src/modules/webhook/webhook.routes.ts` |
| `/api/v1/graphql` | `src/server/src/graphql/index.ts` |
| `/api/v1/users` | user routes |
| `/api/v1/auth` | auth routes |
| `/api/v1/products` | product routes |
| `/api/v1/transactions` | transaction routes |
| `/api/v1/reviews` | review routes |
| `/api/v1/categories` | category routes |
| `/api/v1/cart` | cart routes |
| `/api/v1/checkout` | checkout routes |
| `/api/v1/reports` | report routes |
| `/api/v1/analytics` | analytics routes |
| `/api/v1/logs` | log routes |
| `/api/v1/orders` | order routes |
| `/api/v1/shipment` | shipment routes |
| `/api/v1/payments` | payment routes |
| `/api/v1/addresses` | address routes |
| `/api/v1/sections` | section routes |
| `/api/v1/attributes` | attribute routes |
| `/api/v1/chat` | chat routes |
| `/api/v1/variants` | variant routes |
| `/api/v1/mrk` | MRK routes currently present in the dirty tree |

Registered route details:

| Base | Methods/paths |
| --- | --- |
| `/api/v1/auth` | `GET /google`, `GET /google/callback`, `GET /facebook`, `GET /facebook/callback`, `GET /twitter`, `GET /twitter/callback`, `POST /sign-up`, `POST /sign-in`, `POST /refresh-token`, `POST /forgot-password`, `POST /reset-password`, `GET /sign-out` |
| `/api/v1/users` | `GET /me`, `POST /admin`, `GET /`, `GET /admins`, `GET /profile/:id`, `PUT /:id`, `DELETE /:id` |
| `/api/v1/products` | `GET /`, `GET /:id`, `GET /slug/:slug`, `PUT /:id`, `POST /`, `POST /bulk`, `DELETE /:id` |
| `/api/v1/categories` | `GET /`, `GET /:id`, `POST /`, `DELETE /:id` |
| `/api/v1/variants` | `GET /`, `GET /:id`, `GET /sku/:sku`, `GET /:id/restock-history`, `POST /`, `PATCH /:id`, `POST /:id/restock`, `DELETE /:id` |
| `/api/v1/attributes` | `GET /`, `GET /:id`, `POST /`, `POST /value`, `POST /assign-category`, `DELETE /:id`, `DELETE /value/:id` |
| `/api/v1/cart` | `GET /`, `GET /count`, `POST /`, `PUT /item/:itemId`, `DELETE /item/:itemId`, `POST /merge` |
| `/api/v1/checkout` | `POST /` |
| `/api/v1/orders` | `GET /`, `GET /user`, `GET /:orderId` |
| `/api/v1/payments` | `GET /`, `GET /:paymentId`, `DELETE /:paymentId` |
| `/api/v1/transactions` | `GET /`, `GET /:id`, `PUT /status/:id`, `DELETE /:id` |
| `/api/v1/reviews` | `GET /:productId`, `POST /`, `DELETE /:id` |
| `/api/v1/reports` | `GET /generate` |
| `/api/v1/analytics` | `POST /interactions`, `GET /year-range`, `GET /export` |
| `/api/v1/logs` | `GET /`, `GET /:id`, `GET /:level`, `DELETE /:id`, `DELETE /` |
| `/api/v1/addresses` | `GET /`, `GET /:id`, `DELETE /:id` |
| `/api/v1/shipment` | `POST /` |
| `/api/v1/sections` | `GET /`, `GET /hero`, `GET /promo`, `GET /benefits`, `GET /arrivals`, `POST /`, `PUT /:type`, `DELETE /:type` |
| `/api/v1/chat` | `GET /`, `POST /`, `GET /user`, `GET /:id`, `POST /:chatId/messages`, `PATCH /:chatId/status` |
| `/api/v1/mrk` | `GET /downloads`, `POST /enquiries`, `POST /dealer-applications`, `POST /contact-submissions`, `GET /admin/enquiries`, `PATCH /admin/enquiries/:id/status`, `GET /admin/dealer-applications`, `PATCH /admin/dealer-applications/:id/status`, `GET /admin/contact-submissions`, `PATCH /admin/contact-submissions/:id/status`, `GET /admin/downloads`, `POST /admin/downloads` |

## 6. Prisma Model Summary

Datasource: PostgreSQL via `DATABASE_URL`.

Enums:

- `ROLE`
- `TRANSACTION_STATUS`
- `PAYMENT_STATUS`
- `CART_STATUS`
- `CHAT_STATUS`
- `PRODUCT_CATEGORY_KIND`
- `PRODUCT_PHASE`
- `DOWNLOAD_TYPE`
- `LANGUAGE`
- `LEAD_STATUS`
- `CONTACT_SUBMISSION_TYPE`
- `CONTENT_BLOCK_TYPE`
- `CART_EVENT`
- `SECTION_TYPE`

Models:

- User/auth/customer/admin: `User`
- Catalog: `Product`, `ProductVariant`, `Category`, `Attribute`, `AttributeValue`, `ProductVariantAttribute`, `CategoryAttribute`
- Inventory: `StockMovement`, `Restock`
- Commerce: `Cart`, `CartItem`, `CartEvent`, `Order`, `OrderItem`, `Payment`, `Shipment`, `Transaction`, `Address`
- Engagement/admin: `Review`, `Interaction`, `Report`, `Log`, `Section`
- MRK/catalog-lead models currently present: `Download`, `EnquiryLead`, `DealerApplication`, `ContactSubmission`, `WebsiteContentBlock`
- Chat: `Chat`, `ChatMessage`

## 7. Auth, Admin, and Authorization

Auth stack:

- Cookie JWT auth middleware: `protect`
- Optional cart/session auth: `optionalAuth`
- Role middleware: `authorizeRole`
- Role hierarchy middleware: `authorizeRoleHierarchy`
- Passport OAuth strategies: Google, Facebook, Twitter

Admin-protected modules include users, products, categories, orders, transactions, and MRK admin lead/download routes.

Known risk: some routes that mutate catalog/inventory are not consistently protected, especially attribute and variant routes. This should be reviewed before production.

## 8. Integrations

Uploads:

- Multer uses memory storage in `shared/middlewares/upload.ts`.
- Cloudinary config is in `infra/cloudinary/config.ts`.
- Product, category, section, variant, and chat uploads use Cloudinary helpers or direct streams.

Stripe:

- Stripe client is constructed in `infra/payment/stripe.ts`.
- Checkout module creates Stripe Checkout sessions.
- Webhook module verifies Stripe signatures and processes checkout session completion.
- Startup currently fails if `STRIPE_SECRET_KEY` is missing.

Redis:

- `infra/cache/redis.ts` uses `ioredis` when `REDIS_URL` exists.
- If `REDIS_URL` is missing, current code falls back to in-memory cache/session behavior.

Email:

- `shared/utils/sendEmail.ts` uses Nodemailer.
- Auth password reset flow calls email sending.

Swagger:

- Swagger setup is in `src/server/src/docs/swagger.ts`.
- Mounted at `/api-docs`.

GraphQL:

- Apollo Server mounted at `/api/v1/graphql`.
- Combined v1 schema includes product and analytics GraphQL modules.

Socket.IO:

- Socket manager initializes Socket.IO in `infra/socket/socket.ts`.
- Chat module uses Socket.IO for chat updates and WebRTC signaling.

## 9. Features To Retain For MRK

- Product/category/variant data model and admin CRUD foundation.
- Upload/Cloudinary pipeline for product photos and media.
- Admin authentication and role authorization.
- Public product listing and product detail routes.
- Contact/enquiry/dealer lead models currently present.
- Downloads/content block concepts for catalog/manuals/copy.
- Swagger/API documentation.
- Health endpoints.

## 10. Features To Hide During MRK Conversion

- Public cart entry points.
- Public checkout/payment flow.
- Public order history.
- Consumer review prompts, unless MRK wants testimonials/reviews.
- Generic e-commerce copy and screenshots.
- Generic retail hero/category messaging.

## 11. Features That May Be Removed Later

Only after MRK catalog/enquiry flow is stable:

- Stripe checkout module and webhook.
- Cart and cart event modules.
- Order/payment/shipment/transaction modules.
- Customer order pages.
- Review module if testimonials replace product reviews.
- Chat/WebRTC if MRK does not want real-time support.
- Social OAuth providers if MRK admin login will be email/password only.

## 12. Run Verification

Frontend:

- Started with `npm.cmd --prefix src/client run dev -- -p 3001`.
- Port 3000 was already occupied, so 3001 was used.
- `http://localhost:3001` returned HTTP 200.

Backend:

- Attempted with `npm.cmd --prefix src/server run dev`.
- Backend did not bind to `http://localhost:5000`.
- Nodemon reported app crashed after Redis fallback warning.
- Direct `npx.cmd ts-node -r module-alias/register src/server.ts` also exited with code 1 after Redis fallback warning.

Backend blockers:

- `src/server/.env` was copied from example and has empty `DATABASE_URL`.
- `npx.cmd prisma validate` fails because `DATABASE_URL` resolves to an empty string.
- `STRIPE_SECRET_KEY` is empty; Stripe construction fails with: `Neither apiKey nor config.authenticator provided`.

Database:

- Not migrated.
- Not seeded.
- Database connection not verified because no real `DATABASE_URL` is configured.

Redis:

- No real Redis verified because no `REDIS_URL` is configured.
- Current code reports an in-memory Redis fallback when `REDIS_URL` is missing.

Swagger/API:

- Not reachable because backend did not start with the current `.env`.

Seeded login/admin dashboard:

- Real seeded login was not verified because seed was not run and backend/database are not configured.
- Frontend demo mode is enabled in `src/client/.env.local`, but real backend seeded login remains blocked.

Product listing:

- Frontend page can load in demo mode.
- Backend product API not verified because backend did not start with the current `.env`.

## 13. Quality Checks

| Check | Command | Result |
| --- | --- | --- |
| Frontend build | `npm.cmd --prefix src/client run build` | Passed |
| Frontend lint | `npm.cmd --prefix src/client run lint` | Failed |
| Backend TypeScript build | `npm.cmd --prefix src/server run build` | Passed |
| Prisma schema validation | `npx.cmd prisma validate` from `src/server` | Failed |
| Existing tests | searched for test/spec files | None found |

Frontend build warnings:

- Next build skips type validation and linting due current project config.
- Debug logs print during static generation, especially `isAuthenticated` and `isLoading`.

Frontend lint failures:

- Unused variables/imports in chat components.
- React hook order violations in `app/(private)/dashboard/chats/page.tsx`.
- React hook order violations in `app/(private)/support/page.tsx`.
- Unused variable in `app/hooks/catalog/useShopProducts.ts`.
- Unescaped apostrophe in `app/maintenance/page.tsx`.

Prisma validation failure:

- `DATABASE_URL` is empty in `src/server/.env`.

## 14. Migration Risks

- Dirty tree includes both baseline cleanup and MRK-oriented changes; isolate future commits carefully.
- Docker Compose cannot be used until deleted Docker files are restored or replaced.
- Backend startup is tightly coupled to Stripe env at import time.
- Database health checks may be misleading because `connectDB()` catches errors internally.
- Frontend production build can pass while lint/type errors remain hidden.
- Admin route protection is inconsistent across some catalog-related modules.
- Existing local `src/client/.env.local` is demo-mode oriented, not full backend mode.
- Seed data contains generic e-commerce users/products, not final MRK catalog content.

## 15. Commands Used

```bash
git status --short
git branch --show-current
node --version
npm.cmd --version
docker --version
docker compose version
git switch -c feat/mrk-tradex-rebuild
rg --files
Get-ChildItem -Force
Copy-Item -LiteralPath src\.env.example -Destination src\.env
Copy-Item -LiteralPath src\server\.env.example -Destination src\server\.env
npm.cmd --prefix src/client run dev -- -p 3001
npm.cmd --prefix src/server run dev
npx.cmd ts-node -r module-alias/register src/server.ts
npx.cmd prisma validate
npm.cmd --prefix src/client run build
npm.cmd --prefix src/client run lint
npm.cmd --prefix src/server run build
```

## 16. Phase 1 Stop Point

Stop after this audit. Before Phase 2, configure a real local PostgreSQL database and server secrets, then rerun:

```bash
cd src/server
npx prisma validate
npx prisma migrate dev
npm run seed
npm run dev
```

Then verify:

- `http://localhost:5000/health`
- `http://localhost:5000/api-docs`
- `http://localhost:5000/api/v1/products`
- seeded admin sign-in
- admin dashboard
- product listing
