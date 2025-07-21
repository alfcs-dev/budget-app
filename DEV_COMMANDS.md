# Development Commands Quick Reference

## 🚀 **Starting the Application**

```bash
# Start everything (recommended for development)
npm run dev

# Start only backend (NestJS API)
npm run dev:backend

# Start only frontend (React app)
npm run dev:frontend
```

## 🗄️ **Database Commands**

```bash
# Generate Prisma client (after schema changes)
npm run db:generate

# Create and run new migration
npm run db:migrate

# Open Prisma Studio (database GUI)
npm run db:studio

# Reset database (caution: deletes all data)
cd apps/backend && npx prisma migrate reset
```

## 🛠️ **NestJS CLI Commands**

```bash
# Navigate to backend first
cd apps/backend

# Generate new controller
npx nest generate controller expenses

# Generate new service
npx nest generate service categories

# Generate complete resource (controller + service + module + DTOs)
npx nest generate resource accounts

# Generate custom components
npx nest generate guard auth-guard
npx nest generate interceptor logging
npx nest generate pipe validation
npx nest generate decorator current-user
```

## 🔧 **Building and Testing**

```bash
# Build both applications
npm run build

# Build only backend
npm run build:backend

# Run tests
npm run test

# Run linting
npm run lint

# Format code
npm run format
```

## 🐳 **Docker Commands**

```bash
# Start PostgreSQL only
docker-compose up postgres -d

# Start all services with Docker
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Reset everything (including volumes)
docker-compose down -v
```

## 🔍 **Debugging & Troubleshooting**

```bash
# Check what's running on ports
lsof -i :3000  # Frontend
lsof -i :3001  # Backend
lsof -i :5432  # PostgreSQL

# Kill process on specific port
lsof -ti:3001 | xargs kill -9

# Clean everything and start fresh
npm run clean
rm -rf node_modules
npm install
docker-compose down -v
docker-compose up postgres -d
npm run db:migrate
npm run dev
```

## 📁 **Project Structure Navigation**

```bash
# Backend code
cd apps/backend/src

# Frontend code
cd apps/frontend/src

# Database schema
cd apps/backend/prisma

# Root configuration
cd . # (project root)
```

## 💡 **Common Development Workflow**

### **Starting Development Session**
```bash
# 1. Start database
docker-compose up postgres -d

# 2. Start applications
npm run dev

# 3. Open Prisma Studio (optional)
npm run db:studio
```

### **Adding New Backend Feature**
```bash
# 1. Navigate to backend
cd apps/backend

# 2. Generate resource
npx nest generate resource budgets

# 3. Update database schema if needed
# Edit: prisma/schema.prisma

# 4. Run migration
npx prisma migrate dev --name add-budgets

# 5. Test the endpoints
# Visit: http://localhost:3001/api
```

### **Adding New Frontend Component**
```bash
# 1. Navigate to frontend
cd apps/frontend/src

# 2. Create component
mkdir components/budgets
touch components/budgets/BudgetList.tsx

# 3. Add routing if needed
# Edit: App.tsx or create new route file
```

## 🎯 **Quick Testing**

```bash
# Test backend API
curl http://localhost:3001/api

# Test frontend
open http://localhost:3000

# Test database connection
cd apps/backend && npx prisma studio
```

## 📊 **Monitoring & Logs**

```bash
# View backend logs only
npm run dev:backend

# View frontend logs only
npm run dev:frontend

# View database logs
docker-compose logs postgres

# Monitor file changes
# The dev command automatically watches for changes
```