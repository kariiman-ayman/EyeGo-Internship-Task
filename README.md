# Admin Sales Dashboard

A lightweight sales management dashboard built with Next.js. It features a mock
authentication flow, persisted sessions, KPI cards, a sales chart, and a
sortable/filterable/paginated orders table with PDF and Excel export — all
wrapped in a minimalist liquid-glass design system.

## Tech Stack

| Layer        | Technology                                        |
| ------------ | ------------------------------------------------- |
| Framework    | Next.js 16 (App Router, Turbopack)                |
| UI           | React 19, TypeScript, Tailwind CSS v4             |
| State        | Redux Toolkit + React-Redux                       |
| Charts       | Recharts                                          |
| Exports      | jsPDF + jspdf-autotable, SheetJS (xlsx)           |
| Icons        | lucide-react                                      |
| Mock API     | Next.js route handlers (`/api/*`)                 |
| Container    | Docker (multi-stage, Next.js `standalone` output) |

## Demo Credentials

```
Email:    admin@example.com
Password: Eyego@2026
```

> These are mock credentials — there is no backend. The session is held in the
> browser and persisted to `localStorage`.

## Getting Started

### Prerequisites

- Node.js 20.9+ (or Docker, see below)

### Run locally (development)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root route redirects to
the login page (or the dashboard if you are already authenticated).

### Run with Docker

```bash
docker compose up -d --build
```

This builds the production image (multi-stage, `standalone` output) and serves
the app on [http://localhost:3000](http://localhost:3000).

Stop it with:

```bash
docker compose down
```

If you rebuild frequently, prefer `docker compose up -d --build` over
`docker run` — compose recreates the container automatically, whereas
`docker run` will report a name conflict until the old container is removed.

## Available Scripts

| Command          | Description                          |
| ---------------- | ------------------------------------ |
| `npm run dev`    | Start the development server         |
| `npm run build`  | Production build                     |
| `npm run start`  | Serve the production build           |
| `npm run lint`   | Run ESLint                           |

## Project Structure

```
src/
├── app/                    # App Router routes
│   ├── api/                # Mock API route handlers (auth, orders)
│   ├── globals.css         # Design system tokens + glass primitives
│   └── page.tsx            # Root: redirects by auth state
├── components/
│   ├── dashboard/SalesChart.tsx
│   ├── orders/OrdersTable.tsx
│   ├── orders/ExportButtons.tsx
│   └── ProtectedRoute.tsx  # Route guard
├── data/                   # Mock data + credentials
├── lib/                    # JWT signing + password hashing + user store
├── store/                  # Redux Toolkit (auth + orders slices)
├── types/order.ts
└── utils/session.ts        # localStorage persistence helpers
```

## Implementation Approach

### State & authentication

The application talks to a mock API implemented as Next.js route handlers,
so the UI uses real `fetch()` calls over HTTP and can be pointed at a real
backend later by changing a few `fetch` URLs:

- `POST /api/auth/signup` — creates an account, returns `{ user, token }`.
- `POST /api/auth/login` — validates credentials, returns `{ user, token }`.
- `GET /api/orders` — returns the mock orders dataset, requires a valid JWT.

Authentication is full sign-up/login. Users are held in an in-memory store
(`src/lib/users.ts`) seeded with the demo admin account; passwords are hashed
with Node's `scrypt` (salt + `timingSafeEqual`). On login/signup the server
issues a real **JWT** signed with `jose` (HS256, 2h expiry), and `/api/orders`
verifies the `Authorization: Bearer` token on every request — returning `401`
when missing, invalid, or expired. A `401` from the API signs the client out.

> The user store is in-memory, so newly created accounts reset on server
> restart; the seeded admin account always works.

Authentication state lives in a Redux Toolkit slice (`authSlice`). Signing in
or up dispatches an async thunk that calls the relevant endpoint; logging out
uses the dashboard header button. Instead of pulling in a persistence library,
the store subscribes to its own changes and serializes the auth slice
(user + token) to `localStorage` through a small helper (`utils/session.ts`),
then rehydrates it when the store initialises. Orders are fetched on dashboard
mount via the `fetchOrders` thunk (sending the token), keeping `loading` /
`failed` states in the slice and rendering skeleton panels while pending.

The JWT signing secret defaults to a development value; override it with the
`JWT_SECRET` environment variable (set in `docker-compose.yml`).

### Routing & route guards

- The root route reads the stored session and has no fixed target: authenticated
  users are sent to `/dashboard`, everyone else to `/login`.
- `ProtectedRoute` wraps the dashboard and redirects unauthenticated visitors
  back to the login page, so the dashboard can never be reached without a
  session.
- Returning to the login page while already authenticated (e.g. browser back or
  a typed URL) logs the user out — a transient `sessionStorage` marker set just
  before navigation prevents this rule from kicking in for the user who just
  authenticated.

### Design system

The UI is a custom liquid-glass design system written in plain CSS + Tailwind,
with no UI framework:

- A fixed aurora gradient background (no `background-attachment`, which is janky
  on mobile).
- Reusable glass primitives: `.glass` panels (frosted background, backdrop blur,
  specular inner highlight), `.glass-input`, gradient `.btn`, translucent
  `.btn-glass`, and tinted `.pill` status chips.
- System font stack (zero network cost), GPU-cheap hover effects that animate
  only `transform`, and `backdrop-filter` applied only to the ~8 panels that need
  it — keeping the bundle and paint cost low.

### Orders table

Orders are loaded from `GET /api/orders`. Filtering, search, sorting, and
pagination are derived from the fetched orders with `useMemo`, so the Redux state
stays a single immutable source. Sortable headers show lucide arrows and
highlight the active direction. Status is rendered with glass pills, and the
same derived dataset feeds both the PDF (`jspdf-autotable`) and Excel (`xlsx`)
exporters.

### Exports

`ExportButtons` builds a report client-side from the currently filtered and
sorted orders. PDF generation uses `jsPDF` with an auto-table layout; Excel uses
SheetJS to build a workbook in the browser.

## License

Private project — no license specified.