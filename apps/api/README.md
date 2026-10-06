# UIGen Backend API Service

A modular, production-ready Express.js and TypeScript REST API powered by MongoDB for the **UIGen CLI** and Web Platform.

---

## 🏗 Architecture & Separation

The backend is organized as a decoupled service under `apps/api` with zero coupling to frontend rendering logic:

```
apps/api/
├── .env.example            # Environment template
├── .env                    # Local environment variables
├── package.json            # Self-contained backend manifest & scripts
├── tsconfig.json           # Dedicated TypeScript configuration
└── src/
    ├── server.ts           # Express server entry, middleware & lifecycles
    ├── seed.ts             # Standalone database seeder script
    ├── lib/
    │   └── jwt.ts          # JWT token signing & verification
    ├── middleware/
    │   ├── auth.ts         # JWT Bearer auth & RBAC (user, admin, superadmin)
    │   ├── error-handler.ts# Centralized error formatter
    │   └── not-found.ts    # 404 response handler
    ├── models/
    │   └── index.ts        # Mongoose schemas: User, Component, ComponentVersion, Theme, Download, AuditLog
    └── routes/
        ├── auth.ts         # /api/v1/auth (register, login, refresh, me, logout)
        ├── components.ts   # /api/v1/components (list, get, versions)
        ├── themes.ts       # /api/v1/themes (list, tokens, dynamic CSS vars)
        ├── registry.ts     # /api/v1/registry (full index sync, search, download tracking)
        └── admin.ts        # /api/v1/admin (analytics, CRUD components, theme publisher, audit logs)
```

---

## 🚀 Quick Start (Standalone Running)

You can run this backend independently from anywhere:

### 1. Install dependencies
```bash
# Inside apps/api or from monorepo root:
pnpm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/uigen
JWT_SECRET=your-secure-jwt-secret
JWT_REFRESH_SECRET=your-secure-refresh-secret
CORS_ORIGIN=http://localhost:3000
```

### 3. Seed Database
Populate MongoDB with default superadmin (`admin@uigen.dev` / `Admin@123456`), core components, and themes:
```bash
pnpm --filter @uigen/api seed
# Or inside apps/api:
npm run seed
```

### 4. Start Development Server
```bash
pnpm --filter @uigen/api dev
# Or inside apps/api:
npm run dev
```

Server runs on: **http://localhost:4000**  
Health Check: **http://localhost:4000/api/health**

---

## 📡 API Endpoints

### 1. Authentication (`/api/v1/auth`)
| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | Public | Register new user account |
| `POST` | `/login` | Public | Authenticate with email/password (Argon2id) |
| `POST` | `/refresh` | Public | Rotate refresh token and get new access token |
| `POST` | `/logout` | Public | Invalidate refresh token |
| `GET` | `/me` | Bearer | Get current authenticated user profile |

### 2. Components Registry (`/api/v1/components`)
| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Public | Paginated component catalog (with filters: `category`, `type`, `q`) |
| `GET` | `/:slug` | Public | Get component details by slug |
| `GET` | `/:slug/versions` | Public | List published versions for a component |
| `GET` | `/:slug/:version` | Public | Fetch component code files and metadata for version |

### 3. Themes (`/api/v1/themes`)
| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Public | List all design themes |
| `GET` | `/:slug` | Public | Get theme tokens and configuration |
| `GET` | `/:slug/css` | Public | Stream generated CSS variables stylesheet |

### 4. CLI Registry Service (`/api/v1/registry`)
| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/index` | Public | Complete catalog manifest for CLI sync |
| `GET` | `/search` | Public | Fast multi-field registry search |
| `POST` | `/track-download` | Public | Telemetry & download counter increment |

### 5. Admin Backoffice (`/api/v1/admin`)
*(Requires Bearer token with `admin` or `superadmin` role)*
| Method | Path | Description |
|---|---|---|
| `GET` | `/stats` | Global analytics: total users, components, downloads by framework |
| `POST` | `/components` | Publish a new component & initial version |
| `PUT` | `/components/:slug` | Update component metadata & status |
| `POST` | `/components/:slug/versions` | Release new version of a component |
| `POST` | `/themes` | Create a new design theme |
| `GET` | `/users` | List registered users |
| `GET` | `/audit-logs` | Security audit trail of administrative actions |
