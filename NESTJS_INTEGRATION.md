# NestJS CLI Integration Guide

## 🎯 **Overview**

This guide covers how to properly integrate and use NestJS CLI commands in our monorepo structure.

## 🚀 **Starting the Backend**

### **Option 1: Through Turborepo (Recommended)**

```bash
# Start both frontend and backend
npm run dev

# Start only backend
npm run dev:backend

# Start only frontend  
npm run dev:frontend
```

### **Option 2: Direct NestJS CLI**

```bash
# Navigate to backend directory
cd apps/backend

# Development with watch mode
npx nest start --watch

# Or if you have NestJS CLI globally installed
nest start --watch

# Debug mode
npx nest start --debug --watch

# Production mode
npx nest start
```

### **Option 3: Using npm scripts**

```bash
# From project root
cd apps/backend && npm run dev

# Or using package.json scripts
npm run start:backend
```

## 🔧 **Available Commands**

### **From Project Root**

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend |
| `npm run dev:backend` | Start only backend |
| `npm run dev:frontend` | Start only frontend |
| `npm run build:backend` | Build backend |
| `npm run start:backend` | Start built backend |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Prisma Studio |

### **From Backend Directory (`cd apps/backend`)**

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with watch mode |
| `npm run start` | Start normally |
| `npm run start:debug` | Start in debug mode |
| `npm run build` | Build the application |
| `npm run start:prod` | Start production build |
| `npx nest --help` | Show all NestJS CLI commands |

## 🛠️ **NestJS CLI Installation**

### **Local Installation (Recommended)**
The NestJS CLI is already included in the project's devDependencies:

```bash
# Check if CLI is available
cd apps/backend
npx nest --version

# Use CLI commands
npx nest generate controller users
npx nest generate service users
npx nest generate module users
```

### **Global Installation (Optional)**
```bash
# Install globally
npm install -g @nestjs/cli

# Now you can use 'nest' directly
nest --version
nest generate controller users
```

## 🔍 **Troubleshooting**

### **Issue: "nest: command not found"**

**Solution 1: Use npx**
```bash
cd apps/backend
npx nest start --watch
```

**Solution 2: Install globally**
```bash
npm install -g @nestjs/cli
nest start --watch
```

**Solution 3: Use npm scripts**
```bash
npm run dev:backend
```

### **Issue: "Cannot find module '@nestjs/core'"**

**Solution:**
```bash
# Clean and reinstall
cd apps/backend
rm -rf node_modules
npm install

# Or from root
npm install
```

### **Issue: TypeScript compilation errors**

**Solution:**
```bash
cd apps/backend

# Clean build directory
npm run clean

# Rebuild
npm run build

# Start fresh
npm run dev
```

### **Issue: Port already in use**

**Solution:**
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or change port in .env
echo "PORT=3002" >> .env
```

## 🏗️ **Development Workflow**

### **Recommended Development Setup**

1. **Terminal 1: Full Stack**
   ```bash
   npm run dev
   ```

2. **Terminal 2: Database Management**
   ```bash
   npm run db:studio
   ```

3. **Terminal 3: Backend Only (if needed)**
   ```bash
   npm run dev:backend
   ```

### **Using NestJS CLI for Development**

```bash
cd apps/backend

# Generate new resources
npx nest generate resource accounts
npx nest generate controller categories
npx nest generate service expenses

# Generate custom modules
npx nest generate module shared
npx nest generate guard auth
npx nest generate interceptor logging

# Generate tests
npx nest generate controller users --spec
npx nest generate service users --spec
```

## 📁 **File Structure for NestJS Commands**

When using NestJS CLI, files are generated in:

```
apps/backend/src/
├── accounts/
│   ├── accounts.controller.ts
│   ├── accounts.service.ts
│   ├── accounts.module.ts
│   └── dto/
├── auth/
├── users/
└── shared/
    ├── guards/
    ├── interceptors/
    └── decorators/
```

## 🔄 **Hot Reload & Watch Mode**

The development setup includes:

- **NestJS Watch Mode**: Automatically restarts on file changes
- **Turborepo Caching**: Optimizes build times
- **TypeScript Compilation**: Real-time type checking

Monitor logs:
```bash
# Watch all logs
npm run dev

# Watch only backend logs
npm run dev:backend | grep -E "(LOG|ERROR|WARN)"
```

## 🚀 **Production Considerations**

### **Building for Production**
```bash
# Build backend
npm run build:backend

# Start production server
cd apps/backend
npm run start:prod
```

### **Environment Variables**
Ensure production environment has:
- `NODE_ENV=production`
- `DATABASE_URL` (production database)
- `JWT_SECRET` (secure secret)
- `PORT` (server port)

## 💡 **Tips & Best Practices**

1. **Always use `npx` for CLI commands** in a project context
2. **Use Turborepo scripts** for coordinated development
3. **Keep backend and frontend running together** during development
4. **Use Prisma Studio** for database inspection
5. **Leverage NestJS CLI** for consistent code generation

## 🔗 **Useful NestJS CLI Commands**

```bash
cd apps/backend

# Information
npx nest info                    # Project info
npx nest --help                  # All commands

# Generation
npx nest g controller auth       # Generate controller
npx nest g service users         # Generate service  
npx nest g module shared         # Generate module
npx nest g guard jwt             # Generate guard
npx nest g interceptor logging   # Generate interceptor
npx nest g decorator user        # Generate decorator
npx nest g filter http-exception # Generate filter
npx nest g pipe validation       # Generate pipe

# Resource (full CRUD)
npx nest g resource categories   # Generate complete resource

# Advanced
npx nest g library shared        # Generate library
npx nest g application backend   # Generate application
```