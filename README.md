# Blockchain Trust Enterprise

Institutional-grade digital asset entity structuring and wealth concierge platform. We orchestrate legal counsel, registered agents, Web3 exchanges, and crypto accounting tools into a seamless service for crypto professionals.

## Tech Stack

- **Frontend:** Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- **Backend:** Next.js API Routes + SQLite (better-sqlite3)
- **Auth:** Session-based admin authentication
- **UI:** Custom design system with Inter typography, responsive layout

## Features

### Public Website
- Professional landing page with company information
- Services overview and company registration details
- Jurisdiction comparison (Wyoming, Delaware, Nevada)
- Contact form for free structural assessment
- FAQ section

### Admin Dashboard (`/admin`)
- **Login:** Secure admin authentication (`/admin/login`)
- **Dashboard:** Real-time stats, onboarding pipeline, client breakdowns
- **Clients:** Full CRUD with search, filter, workflow tracking
- **Entities:** LLC management with status lifecycle tracking
- **Partners:** Network management across 6 categories
- **Treasury:** Bank accounts, exchange accounts, multi-sig wallets
- **Accounting:** Tax tracking, compliance, cost basis management
- **Onboarding:** 5-step client onboarding wizard

### Client Types
- HNW Crypto Investors & Traders
- Web3 Founders & DAO Members
- Crypto Miners & Staking Operators

### Entity Types
- Holding LLC (passive asset protection)
- Operating LLC (active trading/mining)
- DAO LLC (Wyoming decentralized governance)

## API Endpoints

| Endpoint | Methods | Description |
|---|---|---|
| `/api/auth` | POST | Admin authentication |
| `/api/stats` | GET | Dashboard statistics |
| `/api/clients` | GET, POST | List/create clients |
| `/api/clients/[id]` | GET, PUT, DELETE | Client detail/update/delete |
| `/api/entities` | GET, POST, PUT | List/create/update entities |
| `/api/partners` | GET, POST | List/create partners |
| `/api/workflows` | GET, PUT | List/update workflow steps |
| `/api/treasury` | GET, POST | List/create treasury accounts |
| `/api/documents` | GET, POST | List/create documents |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public website.

### Admin Access
Navigate to `/admin/login` and use:
- **Email:** admin@bte.com
- **Password:** admin123

## Database

SQLite database auto-created at `data/platform.db` on first run.
Pre-seeded with 8 partner organizations across 6 categories.
