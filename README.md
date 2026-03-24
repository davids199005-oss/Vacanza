# Vacanza

A modern fullstack travel platform for managing vacations and destinations: authentication, user profile, likes, AI recommendations, and an MCP-powered chat experience.

![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=0B1220)
![Express](https://img.shields.io/badge/Express-5-111111?logo=express)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)

## Features

- JWT-based authentication and authorization.
- User flows: vacations catalog, details page, likes, profile and avatar management.
- AI travel recommendations powered by OpenAI.
- MCP chat endpoint with tool-calling support.
- Admin dashboard: create, update, delete vacations and view reports.
- API hardening with `helmet`, CORS configuration, and rate limiting.

## Screenshots

### Public and Auth

<p align="center">
  <img src="docs/landing%20page.png" alt="Landing page" width="48%" />
  <img src="docs/login%20page.png" alt="Login page" width="48%" />
</p>
<p align="center">
  <img src="docs/register%20page.png" alt="Register page" width="48%" />
</p>

### User Area

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

### Admin Area

<p align="center">
  <img src="docs/admin%20dashboard.png" alt="Admin dashboard" width="48%" />
  <img src="docs/vacation%20adding%20form.png" alt="Vacation creation form" width="48%" />
</p>
<p align="center">
  <img src="docs/vacation%20edit%20.png" alt="Vacation edit form" width="48%" />
  <img src="docs/reports%20page.png" alt="Reports page" width="48%" />
</p>

## Tech Stack

### Frontend

- React 19 + TypeScript + Vite
- Redux Toolkit
- React Router
- Ant Design
- Framer Motion
- Recharts
- Zod

### Backend

- Node.js + Express 5 + TypeScript
- MySQL 8 (`mysql2`)
- JWT, bcrypt
- OpenAI SDK + Model Context Protocol SDK
- `express-mcp-handler`
- `helmet`, `cors`, `express-rate-limit`, `multer`

### Infrastructure

- Docker + Docker Compose
- SQL bootstrap from `database/MySQL/vacanza.sql`

## Architecture

```text
Vacanza/
├── frontend/         # React application
├── backend/          # Express API + MCP integration
├── database/MySQL/   # MySQL initialization scripts
├── docs/             # UI screenshots
└── compose.yaml      # Service orchestration
```

Core API domains:

- `auth`: register and login.
- `vacations`: vacation CRUD and likes.
- `users`: profile, avatar, password, liked vacations.
- `recommendations`: AI travel recommendations.
- `mcp`: protocol endpoint and user-facing `/ask`.

## Quick Start

### Option 1: Docker Compose

1. Create `backend/.env` (example below).
2. Ensure Docker is running.
3. Run from the project root:

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost`
- Backend API: `http://localhost:3000`
- Health check: `http://localhost:3000/ping`

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

Services:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`

## Environment Variables

Required backend variables (`backend/.env`):

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

Optional frontend variables (`frontend/.env`):

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ASSETS_BASE_URL=http://localhost:3000/images
```

## API Overview

Base URL: `http://localhost:3000/api`

- `POST /auth/register` - register a user.
- `POST /auth/login` - login and receive JWT.
- `GET /vacations` - list vacations.
- `POST /vacations/:vacationId/likes` - add like.
- `DELETE /vacations/:vacationId/likes` - remove like.
- `POST /recommendations` - generate AI recommendation.
- `GET /users/me` - get current user profile.
- `PATCH /users/me/avatar` - update user avatar.
- `POST /mcp/ask` - ask question via MCP chat.

Protocol MCP endpoint: `POST /mcp`.

