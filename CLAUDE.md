# CLAUDE.md

Guidance for working in this repo.

## What this is

**gtours** — a travel agency website for tours around Georgia (Tbilisi, Kakheti, Batumi, etc.). Users browse tours, book them, pay online, and manage bookings; admins manage tours/blogs/ratings/bookings. Visual style is intentionally **simple and conventional** — clean shadcn/ui defaults, no flashy design. Don't over-design; match the existing plain look.

## Stack

- **Next.js 15** App Router (`next dev --turbopack`), **React 19**, **TypeScript** (strict).
- **Tailwind v4** + **shadcn/ui** (new-york style, `neutral` base, CSS variables). Icons: `lucide-react`.
- **Firebase**: client SDK (`src/firebase/client.ts`) for auth/firestore/storage; **firebase-admin** (`src/firebase/server.ts`) for server-side data. Firestore is the database.
- **next-intl** for i18n. **Bank of Georgia (BOG)** for payments.
- Path alias: `@/*` → `src/*`.

Scripts: `npm run dev` (port 3000), `build`, `start`, `lint`.

## Layout

- `src/app/[locale]/` — all pages are under a locale segment. Public pages (tour, blog, about, contact, destinations), `(auth)` group, `account/` (auth-gated), `admin/` (admin-gated).
- `src/app/api/` — route handlers: payments/checkout/cart/invoices + `webhooks/bog-payment`.
- `src/data/*.ts` — server-only data layer (`import "server-only"`), talks to firebase-admin, wraps reads in `unstable_cache`. This is where Firestore access lives.
- `actions.ts` files (co-located per route) — server actions (`"use server"`).
- `src/context/` — client React contexts: `auth`, `cart`, `booking`, `actions`.
- `src/components/ui/` — shadcn primitives; `src/components/{layout,booking,carousel,map}/` — feature components.
- `src/types/`, `src/validation/` (zod schemas), `src/hooks/`, `src/lib/` (helpers).
- `docs/` — feature write-ups (auth, booking bar, cart, search bar). Consult before changing those features.

## i18n — important

- Locales: `en`, `ge` (Georgian), `ru`. Default `en`. Config in `src/i18n/routing.ts`, messages in `src/messages/{en,ge,ru}.json`.
- **Localized content in Firestore is stored as arrays `[EN, GE, RU]`** (see `src/types/Tour.ts`: `title: string[]`). Index by locale order, not object keys. `src/data/tours.ts` has migration logic for old non-array docs — keep the array shape.
- Fonts are swapped per locale in `src/app/[locale]/layout.tsx` (`fonts.ts`).
- Use next-intl navigation (`src/i18n/navigation.ts`) for locale-aware links.

## Auth & access control

- Firebase Auth (email/password + Google). On login the client syncs the Firebase ID token to server cookies (`firebaseAuthToken`, `firebaseAuthRefreshToken`) via server actions in `src/context/actions.tsx`.
- **Admin = Firebase custom claim `admin`** on the token.
- `src/middleware.ts` gates routes by decoding the JWT: `/admin/**` requires `admin` claim, `/account/**` requires any auth; expired tokens redirect to `/api/refresh-token`. It also runs next-intl locale routing.
- Client access: `useAuth()` from `src/context/auth.tsx` (`currentUser`, `customClaims`, `loginWith*`, `logout`).

## Conventions

- **No code comments.** When you'd write an inline/block comment to explain code, instead append that explanation to `contents.md` in the repo root (create it if missing). Keep the code itself comment-free.
- Server components / data layer fetch via `src/data/*`; mutations via server actions. Don't call firebase-admin from client code.
- Validate inputs with the zod schemas in `src/validation/`.
- Mobile vs desktop is decided **server-side** by user-agent (`src/lib/isMobile.ts`) — layout renders `Navbar`/`MobileNavbar`/`BottomNavigation` accordingly.
- Brand colors: primary dark (`--color-brand-primary`), secondary red (`--color-brand-secondary`) in `src/styles/globals.css`. Reuse existing CSS vars / shadcn tokens rather than hardcoding colors.

## Env

Firebase (`NEXT_PUBLIC_FIREBASE_*` client + `FIREBASE_PRIVATE_KEY`/`FIREBASE_CLIENT_EMAIL`/etc. admin) and BOG payments (`BOG_API_CLIENT_ID`, `BOG_API_CLIENT_SECRET`, `NEXTAUTH_URL`). See `.env.example`.
