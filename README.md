# WebTrail

A small invented web — 10 cross-linked sites, a handful of people to browse as, and a browser to explore it with. Built with NestJS + MongoDB (backend) and Next.js + Tailwind (frontend).

## Prerequisites

- Node.js version 22.23.2
- A MongoDB connection string (Atlas or local)

## 1. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:


Seed the database (safe to re-run — wipes and rebuilds deterministically):

```bash
npm run seed
```

Start the API:

```bash
npm run start:dev
```

Runs on `http://localhost:3000`.

## 2. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:


Start the app:

```bash
npm run dev
```

Runs on `http://localhost:3001`.


## Troubleshooting: MongoDB connection times out (Windows)

If `npm run start:dev` or `npm run seed` hangs or fails with a DNS/SRV
lookup error (e.g. `querySrv ETIMEOUT`), your system's DNS resolver may
not be resolving the `mongodb+srv://` SRV records correctly — this is
a known issue on some Windows setups and networks.

Fix: uncomment these two lines at the top of `main.ts` (or `scripts/seed.ts`):

​```typescript
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
​```

This forces Node to resolve DNS through Google/Cloudflare's public
servers instead of your system default, which reliably supports the
SRV lookups Atlas connection strings depend on. Not needed if your
connection already works without it.

## Using it

Open `http://localhost:3001`, pick a name, and either type an address (e.g. `tidepool.zz`) or search a word (e.g. `kelp`) into the bar.

**Keyboard shortcuts:**
- `Alt + ←` / `Alt + →` — back / forward
- `Ctrl/Cmd + K` — focus the address bar
- `Ctrl/Cmd + H` — history
- `Ctrl/Cmd + Shift + P` — publish

## Notes on the model

- **Back/forward** is implemented as an explicit pointer into a per-session address list, not Next.js routing — this keeps it provably correct and independent of the real browser's own history.
- **Untrusted page HTML** is rendered inside a sandboxed `<iframe>` (`sandbox="allow-same-origin"`, no `allow-scripts`), which blocks any `<script>` in a published page from running.
- Every navigation — typed, followed link, back, forward, or history jump — is recorded as a `Visit` with an `arrivedVia` field, so history reflects the full session, not just fresh navigations.