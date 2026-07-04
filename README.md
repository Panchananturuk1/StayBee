# StayBee
A hotel discovery + booking demo web app (no payments) built with React + Vite + Tailwind.

## Features
- Explore & search hotels with filters and sorting
- Hotel detail pages with rooms and reviews
- Checkout flow that creates a local (demo) booking
- Bookings management (cancel supported)
- Wishlist (saved hotels)
- Demo sign-in / sign-up (local only)

## Local Development
```bash
npm install
npm run dev
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

Client-side routing is handled via [vercel.json](file:///workspace/vercel.json).
