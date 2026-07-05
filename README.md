# StayBee
A hotel discovery + booking app built with React + Vite + Tailwind, backed by Neon Postgres via Prisma.

## Features
- Explore & search hotels with filters and sorting
- Hotel detail pages with rooms and reviews
- Checkout flow that stores bookings in Postgres
- Bookings management (cancel supported)
- Wishlist (saved hotels) synced to the database
- Sign-in / sign-up with database-backed accounts

## Live Demo
https://stay-bee-alpha.vercel.app/

## Local Development
```bash
npm install
npm run prisma:generate
npm run dev
```

Create a local `.env` file from `.env.example` and add your Neon connection strings before running database features.

To create the tables in Neon:
```bash
npm run prisma:push
```

## Production Build
```bash
npm run build
npm run preview
```

## Deploy to Vercel
1. Push this repo to GitHub.
2. In Vercel, import the GitHub repository.
3. Framework preset: Vite
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING` to the project environment variables.

Client-side routing is handled via [vercel.json](file:///workspace/vercel.json), while the `api` directory contains the serverless database endpoints.
