<div align="center">

# Vacanza

**Modern fullstack travel platform for vacation discovery, planning, and management.**

Authentication, profile management, likes, AI travel recommendations, and MCP-powered chat in one product.

<br />

![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=0B1220)
![Express](https://img.shields.io/badge/Express-5-111111?style=flat-square&logo=express)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=flat-square&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-Integrated-412991?style=flat-square&logo=openai&logoColor=white)

</div>

---

## Table of Contents

- [Why Vacanza](#why-vacanza)
- [Feature Highlights](#feature-highlights)
- [Product Screens](#product-screens)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)

---

## Why Vacanza

Vacanza is built as a production-ready travel platform with a clean split between product UX and engineering foundations:

- fast React frontend with protected and admin routes;
- typed Express backend with layered architecture;
- MySQL persistence with schema bootstrap;
- AI and MCP capabilities for contextual travel assistance.

---

## Feature Highlights

| Area | What You Get |
| --- | --- |
| Authentication | Secure register/login flow with JWT-based authorization |
| User Experience | Vacations catalog, details page, likes, profile and avatar updates |
| AI Recommendations | Personalized travel suggestions powered by OpenAI |
| MCP Chat | Tool-capable Q&A endpoint via MCP integration |
| Admin Panel | Vacation CRUD and reporting views for operational control |
| Security | `helmet`, CORS policy, route-level and global rate limits |

---

## Product Screens

<details open>
<summary><strong>Public and Auth</strong></summary>
<br />
<p align="center">
  <img src="docs/landing%20page.png" alt="Landing page" width="48%" />
  <img src="docs/login%20page.png" alt="Login page" width="48%" />
</p>
<p align="center">
  <img src="docs/register%20page.png" alt="Register page" width="48%" />
</p>
</details>

<details>
<summary><strong>User Area</strong></summary>
<br />
<p align="center">
  <img src="docs/vacations%20page.png" alt="Vacations page" width="48%" />
  <img src="docs/vacation%20details%20.png" alt="Vacation details page" width="48%" />
</p>
<p align="center">
  <img src="docs/user%20profile%20.png" alt="User profile page" width="48%" />
  <img src="docs/recommendations%20page.png" alt="Recommendations page" width="48%" />
</p>
<p align="center">
  <img src="docs/mcp%20page.png" alt="MCP chat page" width="48%" />
</p>
</details>

<details>
<summary><strong>Admin Area</strong></summary>
<br />
<p align="center">
  <img src="docs/admin%20dashboard.png" alt="Admin dashboard" width="48%" />
  <img src="docs/vacation%20adding%20form.png" alt="Vacation creation form" width="48%" />
</p>
<p align="center">
  <img src="docs/vacation%20edit%20.png" alt="Vacation edit form" width="48%" />
  <img src="docs/reports%20page.png" alt="Reports page" width="48%" />
</p>
</details>

---

## Tech Stack

| Layer | Stack |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, Redux Toolkit, React Router, Ant Design, Framer Motion, Recharts, Zod |
| Backend | Node.js, Express 5, TypeScript, MySQL (`mysql2`), JWT, bcrypt, OpenAI SDK, MCP SDK, `express-mcp-handler` |
| Infra | Docker, Docker Compose, MySQL init scripts (`database/MySQL/vacanza.sql`) |

---

## Architecture

### Workspace Overview

```text
Vacanza/
├── frontend/         # React application (Vite + TypeScript)
├── backend/          # Express API + MCP integration (TypeScript)
├── database/MySQL/   # MySQL initialization scripts
├── docs/             # UI screenshots
└── compose.yaml      # Service orchestration
```

### Frontend Structure (`frontend/src`)

```text
frontend/src/
├── api/              # HTTP clients and endpoint wrappers
│   ├── axiosInstance.ts
│   ├── authApi.ts
│   ├── usersApi.ts
│   ├── vacationsApi.ts
│   ├── recommendationsApi.ts
│   └── mcpApi.ts
├── components/       # Reusable UI components
│   ├── Layout/
│   ├── Navbar/
│   ├── SimpleNavbar/
│   ├── Footer/
│   └── VacationCard/
├── config/           # Frontend constants and route/API config
│   └── constants.ts
├── models/           # Domain models and shared types
│   ├── User.ts
│   ├── Vacation.ts
│   ├── Mcp.ts
│   └── Role.ts
├── pages/            # Route-level screens
│   ├── Auth/         # Login/Register
│   ├── Landing/
│   ├── Vacations/
│   ├── VacationDetails/
│   ├── Recommendations/
│   ├── McpChat/
│   ├── Profile/
│   ├── About/
│   ├── NotFound/
│   └── admin/        # AdminVacations, VacationForm, Reports
├── redux/            # Global state (RTK slices + store)
│   ├── Store.ts
│   ├── AppState.ts
│   ├── TokenSlice.ts
│   ├── UserSlice.ts
│   └── VacationsSlice.ts
├── routes/           # Route tree and access guards
│   ├── AppRoutes.tsx
│   ├── ProtectedRoute.tsx
│   └── AdminRoute.tsx
├── schemas/          # Zod validation schemas
│   ├── authSchemas.ts
│   ├── profileSchemas.ts
│   ├── vacationSchemas.ts
│   └── aiSchemas.ts
├── ui/               # Theme and animation tokens
│   ├── theme.ts
│   └── motion.ts
├── utils/            # Pure helpers (formatting, decoding, export, etc.)
│   ├── formatDate.ts
│   ├── formatPrice.ts
│   ├── jwtDecode.ts
│   ├── restoreSession.ts
│   ├── zodErrors.ts
│   └── csvExport.ts
└── main.tsx          # App entry point
```

### Backend Structure (`backend/src`)

```text
backend/src/
├── configs/          # Env, DB pool, rate limiting config
│   ├── env-validator.ts
│   ├── db-config.ts
│   └── ratelimit-config.ts
├── controllers/      # HTTP handlers (request/response layer)
│   ├── auth-controller.ts
│   ├── users-controller.ts
│   ├── vacations-controller.ts
│   ├── recommendations-controller.ts
│   └── mcp-controller.ts
├── enums/            # Shared enums (roles, status codes)
│   ├── roles-enum.ts
│   └── status-codes-enum.ts
├── errors/           # Custom application errors
│   └── base-errors.ts
├── mcp/              # MCP server bootstrapping and tools registration
│   ├── vacanza-mcp-server.ts
│   ├── mcp-register.ts
│   └── mcp-tools.ts
├── middlewares/      # Auth, admin guard, error handling
│   ├── auth-middleware.ts
│   ├── admin-middleware.ts
│   └── error-handler-middleware.ts
├── models/           # Data models and prompt templates
│   ├── users-model.ts
│   ├── vacations-model.ts
│   ├── likes-model.ts
│   ├── jwt-payload-model.ts
│   ├── recommendations-prompt-model.ts
│   └── mcp-prompt-model.ts
├── routes/           # API route modules
│   ├── auth-router.ts
│   ├── users-router.ts
│   ├── vacations-router.ts
│   ├── recommendations-router.ts
│   └── mcp-router.ts
├── schemas/          # Zod request/params validation
│   ├── auth-schema.ts
│   ├── users-schema.ts
│   ├── vacations-schema.ts
│   ├── recommendations-schema.ts
│   ├── mcp-schema.ts
│   └── params-schema.ts
├── services/         # Business logic and orchestration layer
│   ├── auth-service.ts
│   ├── users-service.ts
│   ├── vacations-service.ts
│   ├── recommendations-service.ts
│   └── mcp-service.ts
├── types/            # Express request augmentations
│   └── request-user.d.ts
├── utils/            # Mapping, JWT and file-upload helpers
│   ├── jwt-util.ts
│   ├── multer-util.ts
│   ├── mcp-util.ts
│   ├── map-users-util.ts
│   └── map-vacations-util.ts
└── server.ts         # Application entry point
```

### API Domains

- `auth`: register and login.
- `vacations`: vacation CRUD and likes.
- `users`: profile, avatar, password, liked vacations.
- `recommendations`: AI travel recommendations.
- `mcp`: protocol endpoint and user-facing `/ask`.

---

## Quick Start

### Option 1: Docker Compose

1. Create `backend/.env` using the sample below.
2. Ensure Docker is running.
3. Run from project root:

```bash
docker compose up --build
```

Available services:

- Frontend: `http://localhost`
- Backend API: `http://localhost:3000`
- Health check: `http://localhost:3000/ping`

> **Note:** MySQL schema is initialized automatically from `database/MySQL/vacanza.sql`.

### Option 2: Local Development

#### Backend

```bash
cd backend
npm install
npm start
```

#### Frontend

```bash
cd frontend
npm install
npm start
```

Available services:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`

---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=3000
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=vacanza_user
MYSQL_PASSWORD=123123
MYSQL_DATABASE=vacanza
JWT_SECRET=replace_with_strong_secret
NODE_ENV=development
OPENAI_API_KEY=replace_with_openai_key
MCP_SERVER_URL=http://localhost:3000/mcp
CORS_ORIGIN=http://localhost:5173
```

### Frontend (`frontend/.env`) Optional

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ASSETS_BASE_URL=http://localhost:3000/images
```

---

## API Overview

Base URL: `http://localhost:3000/api`

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login and receive JWT |
| `GET` | `/vacations` | List vacations |
| `POST` | `/vacations/:vacationId/likes` | Add like |
| `DELETE` | `/vacations/:vacationId/likes` | Remove like |
| `POST` | `/recommendations` | Generate AI travel recommendation |
| `GET` | `/users/me` | Get current user profile |
| `PATCH` | `/users/me/avatar` | Update user avatar |
| `POST` | `/mcp/ask` | Ask question via MCP chat |

Protocol MCP endpoint: `POST /mcp`.

