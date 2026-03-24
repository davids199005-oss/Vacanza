<div align="center">

<img src="https://img.shields.io/badge/Vacanza-Travel%20Platform-0A66C2?style=for-the-badge&labelColor=0A66C2&color=0D7C66" alt="Vacanza" />

# Vacanza

**Discover, plan, and manage dream vacations — all in one platform.**

AI-powered travel recommendations, MCP tool-calling chat, admin dashboard,<br />
and a polished user experience built with a modern TypeScript stack.

<br />

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=flat-square&logo=openai&logoColor=white)](https://openai.com/)
[![MCP](https://img.shields.io/badge/MCP-Protocol-FF6F00?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgMThjLTQuNDIgMC04LTMuNTgtOC04czMuNTgtOCA4LTggOCAzLjU4IDggOC0zLjU4IDgtOCA4eiIvPjwvc3ZnPg==&logoColor=white)](#)

<br />

<img src="docs/landing%20page.png" alt="Vacanza Landing Page" width="80%" />

</div>

---

## Table of Contents

- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)

---

## &#x2728; Features

| | Feature | Description |
|---|---|---|
| &#x1F512; | **Authentication** | Secure register and login with JWT tokens and bcrypt password hashing |
| &#x1F30D; | **Vacation Catalog** | Browse destinations with pagination, detailed views, and image galleries |
| &#x2764;&#xFE0F; | **Likes System** | Like and track favorite vacations across sessions |
| &#x1F464; | **User Profile** | Update personal info, upload avatar, change password |
| &#x1F916; | **AI Recommendations** | Personalized travel suggestions powered by OpenAI GPT-4o-mini |
| &#x1F4AC; | **MCP Chat** | Ask questions about vacations via tool-calling Model Context Protocol |
| &#x1F6E0;&#xFE0F; | **Admin Dashboard** | Full vacation CRUD with image upload and analytics reports |
| &#x1F4CA; | **Reports & Charts** | Visual vacation popularity stats with CSV export |
| &#x1F6E1;&#xFE0F; | **Security** | Helmet, CORS, global + per-route rate limiting, Zod validation |

---

## &#x1F4F8; Screenshots

<details open>
<summary><strong>&#x1F3E0; Landing &amp; Authentication</strong></summary>
<br />
<p align="center">
  <img src="docs/landing%20page.png" alt="Landing Page" width="48%" />
  <img src="docs/login%20page.png" alt="Login Page" width="48%" />
</p>
<p align="center">
  <img src="docs/register%20page.png" alt="Register Page" width="48%" />
</p>
</details>

<details>
<summary><strong>&#x1F30D; User Experience</strong></summary>
<br />
<p align="center">
  <img src="docs/vacations%20page.png" alt="Vacations Catalog" width="48%" />
  <img src="docs/vacation%20details%20.png" alt="Vacation Details" width="48%" />
</p>
<p align="center">
  <img src="docs/user%20profile%20.png" alt="User Profile" width="48%" />
  <img src="docs/recommendations%20page.png" alt="AI Recommendations" width="48%" />
</p>
<p align="center">
  <img src="docs/mcp%20page.png" alt="MCP Chat" width="48%" />
</p>
</details>

<details>
<summary><strong>&#x1F6E0;&#xFE0F; Admin Panel</strong></summary>
<br />
<p align="center">
  <img src="docs/admin%20dashboard.png" alt="Admin Dashboard" width="48%" />
  <img src="docs/vacation%20adding%20form.png" alt="Create Vacation" width="48%" />
</p>
<p align="center">
  <img src="docs/vacation%20edit%20.png" alt="Edit Vacation" width="48%" />
  <img src="docs/reports%20page.png" alt="Reports" width="48%" />
</p>
</details>

---

## &#x1F6E0; Tech Stack

<table>
  <tr>
    <td align="center" width="140"><strong>Frontend</strong></td>
    <td>
      <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
      <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
      <img src="https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
      <img src="https://img.shields.io/badge/Redux_Toolkit-764ABC?style=flat-square&logo=redux&logoColor=white" alt="Redux" />
      <img src="https://img.shields.io/badge/Ant_Design-6-0170FE?style=flat-square&logo=antdesign&logoColor=white" alt="Ant Design" />
      <img src="https://img.shields.io/badge/Framer_Motion-E91E63?style=flat-square&logo=framer&logoColor=white" alt="Framer" />
      <img src="https://img.shields.io/badge/Recharts-3-FF6384?style=flat-square" alt="Recharts" />
      <img src="https://img.shields.io/badge/Zod-4-3E67B1?style=flat-square&logo=zod&logoColor=white" alt="Zod" />
    </td>
  </tr>
  <tr>
    <td align="center"><strong>Backend</strong></td>
    <td>
      <img src="https://img.shields.io/badge/Node.js-24-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js" />
      <img src="https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white" alt="Express" />
      <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
      <img src="https://img.shields.io/badge/MySQL-8-4479A1?style=flat-square&logo=mysql&logoColor=white" alt="MySQL" />
      <img src="https://img.shields.io/badge/OpenAI-412991?style=flat-square&logo=openai&logoColor=white" alt="OpenAI" />
      <img src="https://img.shields.io/badge/MCP_SDK-FF6F00?style=flat-square" alt="MCP" />
      <img src="https://img.shields.io/badge/Zod-4-3E67B1?style=flat-square&logo=zod&logoColor=white" alt="Zod" />
    </td>
  </tr>
  <tr>
    <td align="center"><strong>Security</strong></td>
    <td>
      <img src="https://img.shields.io/badge/Helmet-8-111?style=flat-square" alt="Helmet" />
      <img src="https://img.shields.io/badge/bcrypt-6-FF4500?style=flat-square" alt="bcrypt" />
      <img src="https://img.shields.io/badge/JWT-9-000?style=flat-square&logo=jsonwebtokens&logoColor=white" alt="JWT" />
      <img src="https://img.shields.io/badge/Rate_Limiting-8-E0234E?style=flat-square" alt="Rate Limit" />
      <img src="https://img.shields.io/badge/CORS-Configured-green?style=flat-square" alt="CORS" />
    </td>
  </tr>
  <tr>
    <td align="center"><strong>Infrastructure</strong></td>
    <td>
      <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
      <img src="https://img.shields.io/badge/MySQL_Init-SQL-4479A1?style=flat-square&logo=mysql&logoColor=white" alt="SQL" />
    </td>
  </tr>
</table>

---

## &#x1F3D7;&#xFE0F; Architecture

### Project Overview

```text
Vacanza/
├── frontend/             React SPA (Vite + TypeScript)
├── backend/              Express REST API + MCP server
├── database/MySQL/       Schema bootstrap scripts
├── docs/                 UI screenshots
├── compose.yaml          Docker Compose orchestration
└── .gitignore
```

### Frontend (`frontend/src`)

```text
frontend/src/
│
├── api/                  HTTP clients (Axios wrappers)
│   ├── axiosInstance.ts      Configured Axios instance with interceptors
│   ├── authApi.ts            Login / register calls
│   ├── usersApi.ts           Profile, avatar, password, likes
│   ├── vacationsApi.ts       Vacation CRUD + likes
│   ├── recommendationsApi.ts AI recommendation requests
│   └── mcpApi.ts             MCP chat requests
│
├── components/           Shared UI components
│   ├── Layout/               App shell with Navbar + Footer
│   ├── Navbar/               Main navigation bar
│   ├── SimpleNavbar/         Minimal navbar for public pages
│   ├── Footer/               Page footer
│   └── VacationCard/         Vacation card with like button
│
├── config/
│   └── constants.ts      Routes, API endpoints, config values
│
├── models/               TypeScript interfaces
│   ├── User.ts
│   ├── Vacation.ts
│   ├── Mcp.ts
│   └── Role.ts
│
├── pages/                Route-level screens
│   ├── Landing/              Public landing page
│   ├── Auth/                 Login + Register forms
│   ├── Vacations/            Paginated vacation catalog
│   ├── VacationDetails/      Single vacation view
│   ├── Recommendations/      AI travel recommendations
│   ├── McpChat/              MCP-powered Q&A chat
│   ├── Profile/              User profile management
│   ├── About/                About page
│   ├── NotFound/             404 fallback
│   └── admin/
│       ├── AdminVacations/   Admin vacation list
│       ├── VacationForm/     Create / edit vacation
│       └── Reports/          Charts + CSV export
│
├── redux/                State management (Redux Toolkit)
│   ├── Store.ts              Store configuration
│   ├── AppState.ts           Root state type
│   ├── TokenSlice.ts         JWT token state
│   ├── UserSlice.ts          Current user state
│   └── VacationsSlice.ts     Vacations + likes state
│
├── routes/               Routing and access control
│   ├── AppRoutes.tsx         Route definitions
│   ├── ProtectedRoute.tsx    Auth guard
│   └── AdminRoute.tsx        Admin role guard
│
├── schemas/              Zod validation schemas
│   ├── authSchemas.ts
│   ├── profileSchemas.ts
│   ├── vacationSchemas.ts
│   └── aiSchemas.ts
│
├── ui/                   Design tokens
│   ├── theme.ts              Ant Design theme overrides
│   └── motion.ts             Framer Motion presets
│
├── utils/                Pure utility functions
│   ├── formatDate.ts
│   ├── formatPrice.ts
│   ├── jwtDecode.ts
│   ├── restoreSession.ts
│   ├── zodErrors.ts
│   └── csvExport.ts
│
└── main.tsx              Application entry point
```

### Backend (`backend/src`)

```text
backend/src/
│
├── configs/              Application configuration
│   ├── env-validator.ts      Zod-validated environment variables
│   ├── db-config.ts          MySQL connection pool + waitForDb
│   └── ratelimit-config.ts   Global and per-route rate limiters
│
├── controllers/          Request handlers (thin layer)
│   ├── auth-controller.ts
│   ├── users-controller.ts
│   ├── vacations-controller.ts
│   ├── recommendations-controller.ts
│   └── mcp-controller.ts
│
├── enums/                Shared constants
│   ├── roles-enum.ts         User / Admin roles
│   └── status-codes-enum.ts  HTTP status code map
│
├── errors/               Custom error classes
│   └── base-errors.ts        NotFound, Unauthorized, Conflict, etc.
│
├── mcp/                  Model Context Protocol integration
│   ├── vacanza-mcp-server.ts MCP server factory
│   ├── mcp-register.ts       Tool registration
│   └── mcp-tools.ts          Tool definitions (vacation queries)
│
├── middlewares/           Express middleware
│   ├── auth-middleware.ts     JWT verification
│   ├── admin-middleware.ts    Admin role enforcement
│   └── error-handler-middleware.ts  Global error handler
│
├── models/               Data layer interfaces & prompts
│   ├── users-model.ts
│   ├── vacations-model.ts
│   ├── likes-model.ts
│   ├── jwt-payload-model.ts
│   ├── recommendations-prompt-model.ts
│   └── mcp-prompt-model.ts
│
├── routes/               Route modules
│   ├── auth-router.ts        POST /register, /login
│   ├── users-router.ts       GET/PUT/PATCH/DELETE /me
│   ├── vacations-router.ts   CRUD + likes
│   ├── recommendations-router.ts  POST /
│   └── mcp-router.ts         POST /, POST /ask
│
├── schemas/              Zod request validation
│   ├── auth-schema.ts
│   ├── users-schema.ts
│   ├── vacations-schema.ts
│   ├── recommendations-schema.ts
│   ├── mcp-schema.ts
│   └── params-schema.ts
│
├── services/             Business logic
│   ├── auth-service.ts       Register, login, JWT issuance
│   ├── users-service.ts      Profile CRUD, avatar, password
│   ├── vacations-service.ts  Vacation CRUD, likes, queries
│   ├── recommendations-service.ts  OpenAI recommendation generation
│   └── mcp-service.ts        MCP client + OpenAI tool-calling loop
│
├── types/
│   └── request-user.d.ts     Express Request augmentation
│
├── utils/                Shared helpers
│   ├── jwt-util.ts           Token sign / verify
│   ├── multer-util.ts        File upload config (avatars, vacations)
│   ├── mcp-util.ts           MCP helper utilities
│   ├── map-users-util.ts     DB row → User mapping
│   └── map-vacations-util.ts DB row → Vacation mapping
│
└── server.ts             Application entry point
```

---

## &#x1F680; Quick Start

### Prerequisites

- **Node.js** 24+ and **npm**
- **Docker** and **Docker Compose** (for containerized setup)
- **OpenAI API key** (for AI features)

### Option 1 &mdash; Docker Compose (recommended)

```bash
# 1. Create backend env file
cp backend/.env.example backend/.env   # then fill in your values

# 2. Start all services
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | `http://localhost` |
| Backend API | `http://localhost:3000` |
| Health Check | `http://localhost:3000/ping` |

> **Note:** MySQL schema is automatically initialized from `database/MySQL/vacanza.sql` on first run.

### Option 2 &mdash; Local Development

```bash
# Backend
cd backend
npm install
npm start          # nodemon + tsx on port 3000

# Frontend (new terminal)
cd frontend
npm install
npm start          # Vite dev server on port 5173
```

| Service | URL |
|---|---|
| Frontend | `http://localhost:5173` |
| Backend API | `http://localhost:3000` |

---

## &#x1F511; Environment Variables

### Backend &mdash; `backend/.env` (required)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `3000` |
| `MYSQL_HOST` | Database host | `localhost` |
| `MYSQL_PORT` | Database port | `3306` |
| `MYSQL_USER` | Database user | `vacanza_user` |
| `MYSQL_PASSWORD` | Database password | `123123` |
| `MYSQL_DATABASE` | Database name | `vacanza` |
| `JWT_SECRET` | Secret for signing tokens (min 10 chars) | `your_strong_secret` |
| `NODE_ENV` | Environment mode | `development` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |
| `MCP_SERVER_URL` | MCP protocol endpoint URL | `http://localhost:3000/mcp` |
| `CORS_ORIGIN` | Allowed origin (optional) | `http://localhost:5173` |

### Frontend &mdash; `frontend/.env` (optional)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000/api` |
| `VITE_ASSETS_BASE_URL` | Static assets base URL | `http://localhost:3000/images` |

---

## &#x1F4D6; API Reference

Base URL: `http://localhost:3000/api`

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | &#x2014; | Create new user account |
| `POST` | `/auth/login` | &#x2014; | Login and receive JWT |

### Vacations

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/vacations` | &#x1F512; | List vacations with like counts |
| `POST` | `/vacations` | &#x1F512; Admin | Create new vacation |
| `PUT` | `/vacations/:id` | &#x1F512; Admin | Update vacation |
| `DELETE` | `/vacations/:id` | &#x1F512; Admin | Delete vacation |
| `POST` | `/vacations/:id/likes` | &#x1F512; | Like a vacation |
| `DELETE` | `/vacations/:id/likes` | &#x1F512; | Unlike a vacation |

### Users

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/users/me` | &#x1F512; | Get current user profile |
| `PUT` | `/users/me` | &#x1F512; | Update profile info |
| `PATCH` | `/users/me/avatar` | &#x1F512; | Upload new avatar |
| `PATCH` | `/users/me/password` | &#x1F512; | Change password |
| `GET` | `/users/me/likes` | &#x1F512; | Get liked vacations |
| `DELETE` | `/users/me` | &#x1F512; | Delete account |

### AI & MCP

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/recommendations` | &#x1F512; | Generate AI travel recommendation |
| `POST` | `/mcp/ask` | &#x1F512; | Ask a question via MCP chat |
| `POST` | `/mcp` | &#x2014; | MCP protocol transport endpoint |

---

## &#x1F4DC; License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

**Built with TypeScript from frontend to backend.**

</div>
