# ReleaseCheck - Release Checklist Tool

A full-stack web application for managing software release checklists. Built with **React + TypeScript** (frontend) and **Node.js + Express + TypeScript** (backend), backed by **PostgreSQL** via **Prisma ORM**.

## Tech Stack

### Frontend
- **React 18** with TypeScript (Vite)
- **TanStack Query v5** — server state management with optimistic updates
- **Zustand** — client-side UI state management
- **Axios** — HTTP client with interceptors
- **TailwindCSS** — utility-first styling
- **Lucide React** — icon library
- **React Router v6** — client-side routing
- **React Hot Toast** — toast notifications

### Backend
- **Node.js + Express** with TypeScript
- **Prisma ORM** — type-safe database access
- **PostgreSQL** — relational database
- **Zod** — runtime schema validation
- **Helmet** — security headers
- **Morgan** — HTTP request logging

---

## Database Schema

```sql
CREATE TABLE releases (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(255) NOT NULL,
  date            TIMESTAMP NOT NULL,
  additional_info TEXT,
  completed_steps INTEGER[] DEFAULT '{}',
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);
```

The `completed_steps` column stores an array of step IDs (integers) that have been completed. The release **status** is computed (not stored):
- **planned** — no steps completed
- **ongoing** — at least one step completed
- **done** — all steps completed

---

## API Endpoints

| Method   | Endpoint                    | Description                          |
|----------|-----------------------------|--------------------------------------|
| `GET`    | `/api/health`               | Health check                         |
| `GET`    | `/api/releases`             | List all releases                    |
| `GET`    | `/api/releases/steps`       | Get available checklist steps        |
| `GET`    | `/api/releases/:id`         | Get a single release by ID           |
| `POST`   | `/api/releases`             | Create a new release                 |
| `PATCH`  | `/api/releases/:id/info`    | Update release additional info       |
| `PATCH`  | `/api/releases/:id/steps`   | Toggle a step's completion state     |
| `DELETE` | `/api/releases/:id`         | Delete a release                     |

### Request/Response Examples

**Create Release:**
```json
POST /api/releases
{
  "name": "Version 2.0.0",
  "date": "2026-03-01T00:00:00.000Z",
  "additionalInfo": "Major release with new features"
}
```

**Toggle Step:**
```json
PATCH /api/releases/:id/steps
{
  "stepId": 0,
  "completed": true
}
```

**Update Info:**
```json
PATCH /api/releases/:id/info
{
  "additionalInfo": "Updated notes for this release"
}
```

---

## Getting Started

### Prerequisites
- **Node.js** >= 18
- **PostgreSQL** >= 14 (or use Docker)
- **pnpm** >= 9

### 1. Clone the repository
```bash
git clone https://github.com/Prathmesh-Dhatrak/cactro-release-check.git
cd cactro-release-check
```

### 2. Backend Setup
```bash
cd cactro-release-check-be
pnpm install

# Create .env from example
cp .env.example .env
# Edit .env with your PostgreSQL connection string

# Generate Prisma client
pnpm prisma generate

# Run database migrations
pnpm prisma migrate dev --name init

# (Optional) Seed sample data
pnpm run prisma:seed

# Start development server
pnpm run dev
```

The API will be available at `http://localhost:3001/api`.

### 3. Frontend Setup
```bash
cd cactro-release-check-fe
pnpm install

# Start development server
pnpm run dev
```

The app will be available at `http://localhost:5173`.

> The Vite dev server proxies `/api` requests to `http://localhost:3001`, so no CORS issues in development.

---

## Deployment (Production)

### Backend → Render.com

1. Push this repo to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/) → **New** → **Blueprint**
3. Connect your GitHub repo — Render auto-detects `render.yaml`
4. This creates:
   - **PostgreSQL database** (`releasecheck-db`, free tier)
   - **Web service** (`releasecheck-api`, free tier) with auto-configured `DATABASE_URL`
5. After deploy, copy the backend URL (e.g., `https://releasecheck-api.onrender.com`)
6. Set the `CORS_ORIGIN` env var on Render to your Vercel frontend URL

### Frontend → Vercel

1. Go to [Vercel Dashboard](https://vercel.com/new) → **Import** your GitHub repo
2. Set **Root Directory** to `cactro-release-check-fe`
3. Set **Framework Preset** to `Vite`
4. Add environment variable:
   - `VITE_API_BASE_URL` = `https://releasecheck-api.onrender.com/api` (your Render URL)
5. Deploy — Vercel auto-detects `vercel.json` for SPA rewrites

### Post-Deploy Checklist
- Update `CORS_ORIGIN` on Render with the actual Vercel URL
- Update `VITE_API_BASE_URL` on Vercel with the actual Render URL
- (Optional) Seed the database: run `pnpm run prisma:seed` locally with the production `DATABASE_URL`

---

## Docker Setup (Local)

Run the entire stack with Docker Compose:

```bash
docker-compose up --build
```

This starts:
- **PostgreSQL** on port `5432`
- **Backend API** on port `3001`
- **Frontend** on port `5173`

---

## Project Structure

```
cactro-release-check/
├── cactro-release-check-be/          # Backend API
│   ├── prisma/
│   │   ├── schema.prisma             # Database schema
│   │   └── seed.ts                   # Seed data
│   ├── src/
│   │   ├── config/                   # App config, DB client, step definitions
│   │   ├── controllers/              # HTTP request handlers
│   │   ├── middleware/               # Validation, error handling
│   │   ├── routes/                   # Express route definitions
│   │   ├── services/                 # Business logic layer
│   │   ├── types/                    # TypeScript type definitions
│   │   ├── utils/                    # Utility functions
│   │   ├── validators/               # Zod validation schemas
│   │   ├── app.ts                    # Express app factory
│   │   └── server.ts                 # Entry point
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── cactro-release-check-fe/          # Frontend SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/               # Header, Layout
│   │   │   ├── releases/             # CreateReleaseModal
│   │   │   └── ui/                   # StatusBadge, LoadingSpinner, etc.
│   │   ├── config/                   # Constants, query keys
│   │   ├── hooks/                    # TanStack Query hooks
│   │   ├── lib/                      # Axios client
│   │   ├── pages/                    # ReleaseListPage, ReleaseDetailPage
│   │   ├── services/                 # API service layer
│   │   ├── store/                    # Zustand UI store
│   │   ├── types/                    # TypeScript types
│   │   ├── utils/                    # Formatting, status computation
│   │   ├── App.tsx                   # Root component with routing
│   │   └── main.tsx                  # Entry point
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yaml
└── README.md
```

---

## Architecture Highlights

- **Clean Layered Architecture** (Backend): Routes → Controllers → Services → Prisma
- **Zod Validation** on all API inputs with typed error responses
- **TanStack Query** with optimistic updates for instant UI feedback on step toggles
- **Zustand** for lightweight client-side UI state (modals, confirmations)
- **Computed Status** — release status derived from step completion, never stored
- **Type Safety** — strict TypeScript across the entire stack with shared type definitions
- **API Response Envelope** — consistent `{ success, data, message }` format
- **Error Handling** — global error middleware with structured error responses

---

## License

MIT
