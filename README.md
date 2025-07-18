# Expense Tracker - Personal Financial Management

A full-stack TypeScript application for tracking expenses, managing budgets, and monitoring financial accounts, specifically designed for Mexican financial institutions.

## 🏗️ Architecture

- **Backend**: NestJS with TypeScript, Prisma ORM, PostgreSQL
- **Frontend**: React with TypeScript, Vite, Tailwind CSS
- **Infrastructure**: Monorepo with Turborepo, Docker, GitHub Actions

## 📋 Prerequisites

- Node.js 18+ 
- npm 9+
- PostgreSQL 15+ (or use Docker)
- Docker & Docker Compose (optional)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd expense-tracker-monorepo
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your database credentials
# For local development with Docker:
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/expense_tracker?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

### 3. Database Setup

**Option A: Using Docker (Recommended)**
```bash
# Start PostgreSQL
docker-compose up postgres -d

# Run migrations
cd apps/backend
npx prisma migrate dev
npx prisma generate
```

**Option B: Local PostgreSQL**
```bash
# Create database
createdb expense_tracker

# Run migrations
cd apps/backend
npx prisma migrate dev
npx prisma generate
```

### 4. Start Development

```bash
# Start all applications
npm run dev

# Or start individually:
# Backend: cd apps/backend && npm run dev
# Frontend: cd apps/frontend && npm run dev
```

**Access URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Documentation: http://localhost:3001/api

## 📁 Project Structure

```
expense-tracker-monorepo/
├── apps/
│   ├── backend/              # NestJS API
│   │   ├── src/
│   │   │   ├── auth/         # Authentication module
│   │   │   ├── users/        # User management
│   │   │   ├── accounts/     # Financial accounts
│   │   │   ├── categories/   # Expense categories
│   │   │   ├── expenses/     # Expense tracking
│   │   │   └── prisma/       # Database service
│   │   └── prisma/           # Database schema & migrations
│   └── frontend/             # React application
│       ├── src/
│       │   ├── components/   # Reusable components
│       │   ├── pages/        # Page components
│       │   ├── hooks/        # Custom hooks
│       │   └── services/     # API services
│       └── public/
├── packages/                 # Shared packages (future)
├── .github/workflows/        # CI/CD pipeline
└── docker-compose.yml       # Development environment
```

## 🗄️ Database Schema

The application includes these main entities:

- **User**: Authentication and profile management
- **Account**: Financial accounts (checking, savings, credit cards)
- **Category**: Hierarchical expense categorization
- **Expense**: Transaction records with receipts
- **Budget**: Spending limits and monitoring
- **Transfer**: Money transfers between accounts

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Build all applications
npm run build

# Run linting
npm run lint

# Format code
npm run format

# Run tests
npm run test

# Database commands
npm run db:migrate     # Run migrations
npm run db:generate    # Generate Prisma client
npm run db:studio      # Open Prisma Studio
```

## 🐳 Docker Development

```bash
# Start full stack
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after changes
docker-compose up --build
```

## 🚀 Deployment to Digital Ocean

### 1. Droplet Setup

```bash
# SSH into your droplet
ssh root@your-droplet-ip

# Install Node.js, npm, PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs
npm install -g pm2

# Install PostgreSQL
apt update
apt install postgresql postgresql-contrib
```

### 2. Application Setup

```bash
# Clone repository
cd /var/www
git clone <your-repo-url> expense-tracker
cd expense-tracker

# Install dependencies
npm ci

# Setup environment
cp .env.example .env
# Edit .env with production values

# Setup database
sudo -u postgres createdb expense_tracker
cd apps/backend
npx prisma migrate deploy
npx prisma generate
```

### 3. PM2 Configuration

```bash
# Start applications with PM2
pm2 start apps/backend/dist/main.js --name expense-tracker-backend
pm2 start "npm run start" --name expense-tracker-frontend --cwd apps/frontend

# Save PM2 configuration
pm2 save
pm2 startup
```

### 4. GitHub Actions Setup

Add these secrets to your GitHub repository:

- `DO_HOST`: Your droplet IP address
- `DO_USERNAME`: SSH username (usually `root`)
- `DO_PRIVATE_KEY`: Your SSH private key
- `DO_PORT`: SSH port (usually `22`)

## 📈 Development Phases

### Phase 1: Core Foundation ✅
- [x] Project setup and monorepo structure
- [x] Authentication system
- [x] Basic database schema
- [x] API documentation with Swagger

### Phase 2: Core Features (Next)
- [ ] Account management CRUD
- [ ] Category management with hierarchy
- [ ] Expense tracking and receipts
- [ ] Basic dashboard and reports

### Phase 3: Advanced Features
- [ ] Budget management and alerts
- [ ] Transfer tracking
- [ ] Data import/export
- [ ] Advanced reporting and analytics

### Phase 4: Enhanced UX
- [ ] Mobile-responsive design
- [ ] Offline capabilities
- [ ] Receipt OCR scanning
- [ ] Notification system

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test thoroughly
3. Run linting and tests: `npm run lint && npm run test`
4. Commit with clear message: `git commit -m "feat: add expense tracking"`
5. Push and create PR: `git push origin feature/your-feature`

## 📄 License

This project is private and proprietary.

## 🆘 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Reset database
dropdb expense_tracker
createdb expense_tracker
cd apps/backend && npx prisma migrate dev
```

### Port Conflicts
```bash
# Kill processes on specific ports
lsof -ti:3000 | xargs kill -9  # Frontendgit 
lsof -ti:3001 | xargs kill -9  # Backend
```

### Prisma Issues
```bash
# Reset Prisma client
cd apps/backend
rm -rf node_modules/.prisma
npx prisma generate
```

For more detailed troubleshooting, check the application logs or create an issue.