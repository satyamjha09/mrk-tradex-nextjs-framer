# Vercel Deployment

This project now serves the Next.js frontend and the Express/Prisma backend from one Vercel deployment.

## What changed

- Production frontend API calls default to `/api/v1`.
- `pages/api/v1/[...path].ts` forwards Vercel API requests to the compiled Express app.
- `npm run build` compiles the backend first, then builds Next.js.
- Runtime backend files are included through `next.config.ts`.
- Cloudinary is required for production image uploads because Vercel has no persistent upload disk.
- OAuth and Stripe no longer crash product/catalog APIs when their optional secrets are missing.

## Required Vercel environment variables

Set these in the Vercel project settings:

```env
DATABASE_URL=postgresql://...
ACCESS_TOKEN_SECRET=...
REFRESH_TOKEN_SECRET=...
SESSION_SECRET=...
COOKIE_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NEXT_PUBLIC_USE_DEMO_CATALOG=false
NEXT_PUBLIC_DEMO_MODE=false
```

`NEXT_PUBLIC_API_URL_PROD` can be omitted. If you set it, use `/api/v1`.

Optional:

```env
CLIENT_URL_PROD=https://your-domain.vercel.app
ALLOWED_ORIGINS=https://your-domain.vercel.app
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...
TWITTER_CONSUMER_KEY=...
TWITTER_CONSUMER_SECRET=...
NEXT_PUBLIC_SOCKET_URL=https://your-realtime-server.example.com
```

## Database setup

Vercel cannot use your local PostgreSQL database. Use an online PostgreSQL database, then run migrations once against that database:

```powershell
npm --prefix apps/ecommerce/server run prisma -- migrate deploy
npm --prefix apps/ecommerce/server run seed
npm --prefix apps/ecommerce/server run seed:mrk-panel
```

## Notes

Vercel serverless functions do not support the current long-running Socket.IO server. Product catalog, admin CRUD, uploads through Cloudinary, REST APIs, and GraphQL run through `/api/v1`. For realtime chat/calls, use a separate websocket host or a realtime service such as Ably or Pusher.
