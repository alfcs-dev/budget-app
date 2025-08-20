# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an expense tracking monorepo using Turborepo with NestJS backend and React frontend. The application manages personal expenses, budgets, categories, and financial accounts with PostgreSQL database.

## Common Development Commands

### Starting Development
- `npm run dev` - Start both frontend and backend with hot reload
- `npm run dev:backend` - Start only NestJS backend (port 3001)
- `npm run dev:frontend` - Start only React frontend (port 3000)

### Database Operations
- `npm run db:generate` - Generate Prisma client after schema changes
- `npm run db:migrate` - Create and run database migrations
- `npm run db:studio` - Open Prisma Studio GUI (port 5555)

### Testing and Quality
- `npm run test` - Run tests across all apps
- `npm run lint` - Run ESLint across all apps
- `npm run format` - Format code with Prettier

### Docker Environment
- `docker-compose up postgres -d` - Start PostgreSQL only
- `docker-compose up -d` - Start all services
- `docker-compose down` - Stop all services

### NestJS CLI (from apps/backend/)
- `npx nest generate resource [name]` - Generate complete CRUD resource
- `npx nest generate controller [name]` - Generate controller only
- `npx nest generate service [name]` - Generate service only

## Architecture

### Backend (NestJS - Port 3001)
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: JWT with passport strategies
- **Modules**: auth, users, accounts, categories, expenses
- **API Docs**: Available at http://localhost:3001/api

### Frontend (React - Port 3000)
- **Framework**: React with Vite, TypeScript
- **Styling**: Tailwind CSS
- **State**: React Query for server state, Context for auth
- **Routing**: React Router DOM

### Database Schema
Key entities: User, Account (financial accounts), Category (expense categories), Expense, Budget, Transfer. All entities are user-scoped with cascade delete.

## Development Workflow

1. **Start Development**: Run `docker-compose up postgres -d` then `npm run dev`
2. **Database Changes**: Edit `apps/backend/prisma/schema.prisma` then run `npm run db:migrate`
3. **Backend Changes**: Use NestJS CLI for consistent code generation
4. **Environment**: Backend uses `.env` file, frontend uses `VITE_` prefixed variables

## Key Files and Locations

- **Prisma Schema**: `apps/backend/prisma/schema.prisma`
- **Backend Entry**: `apps/backend/src/main.ts`
- **Frontend Entry**: `apps/frontend/src/main.tsx`
- **Auth Service**: `apps/backend/src/auth/auth.service.ts`
- **Database Service**: `apps/backend/src/prisma/prisma.service.ts`

## Troubleshooting

- **Port conflicts**: Check with `lsof -i :3000` and `lsof -i :3001`
- **Database issues**: Restart with `docker-compose down -v && docker-compose up postgres -d`
- **Dependencies**: Run `npm install` in root, backend, and frontend directories
- **Type errors**: Run `npm run db:generate` after schema changes
- run every npm command in this project with a previous slash i.e. \npm run dev, \npm install