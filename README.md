# OPS Logistics

Shipping and logistics website with an admin dashboard.

## Structure

- `app/`, `components/`: Next.js 16 frontend (public site and `/admin` dashboard)
- `backend/`: Express API (auth, shipments, uploads to Cloudinary, Neon PostgreSQL). Deployed separately; see `backend/README.md`

## Running locally

Frontend:

```bash
npm install
npm run dev
```

Backend:

```bash
cd backend
npm install
npm run dev
```

The frontend reads `NEXT_PUBLIC_API_URL` (see `.env.example`) to reach the backend. Secrets live in `backend/.env` and are never committed.
