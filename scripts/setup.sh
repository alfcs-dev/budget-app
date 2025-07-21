#!/bin/bash

echo "🚀 Setting up Expense Tracker application..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

if ! command_exists docker; then
    echo -e "${YELLOW}⚠️  Docker is not installed. You'll need to setup PostgreSQL manually.${NC}"
fi

echo -e "${GREEN}✅ Prerequisites check completed${NC}"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dependencies installed${NC}"

# Check Turborepo version
echo "🌪️ Checking Turborepo..."
TURBO_VERSION=$(npx turbo --version 2>/dev/null || echo "Unknown")
echo -e "${BLUE}   Turborepo Version: ${TURBO_VERSION}${NC}"

if npx turbo --help > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Turborepo is working correctly${NC}"
else
    echo -e "${YELLOW}⚠️  Turborepo might need additional setup${NC}"
fi

# Check NestJS CLI availability
echo "🔧 Checking NestJS CLI..."
cd apps/backend

if npx nest --version > /dev/null 2>&1; then
    echo -e "${GREEN}✅ NestJS CLI is available${NC}"
    NEST_VERSION=$(npx nest --version 2>/dev/null || echo "Unknown")
    echo -e "${BLUE}   Version: ${NEST_VERSION}${NC}"
else
    echo -e "${YELLOW}⚠️  NestJS CLI not found, but it's included in dependencies${NC}"
fi

cd ../..

# Setup environment files
echo "🔧 Setting up environment files..."

# Backend .env
if [ ! -f "apps/backend/.env" ]; then
    echo "Creating backend .env file..."
    cat > apps/backend/.env << 'EOF'
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/expense_tracker?schema=public"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Application URLs
FRONTEND_URL="http://localhost:3000"
BACKEND_URL="http://localhost:3001"

# Environment
NODE_ENV="development"

# Server Port
PORT=3001
EOF
    echo -e "${GREEN}✅ Backend .env file created${NC}"
else
    echo -e "${YELLOW}⚠️  Backend .env file already exists${NC}"
fi

# Test environment loading
echo "🧪 Testing environment variable loading..."
cd apps/backend

if [ -f "check-env.js" ]; then
    ENV_CHECK_OUTPUT=$(node check-env.js 2>&1)
    if echo "$ENV_CHECK_OUTPUT" | grep -q "PORT.*3001"; then
        echo -e "${GREEN}✅ Environment variables loading correctly${NC}"
    else
        echo -e "${YELLOW}⚠️  Environment variable loading might have issues${NC}"
        echo "Output: $ENV_CHECK_OUTPUT"
    fi
else
    echo -e "${YELLOW}⚠️  Environment check script not found${NC}"
fi

cd ../..

# Start PostgreSQL with Docker (if available)
if command_exists docker && command_exists docker-compose; then
    echo "🐳 Starting PostgreSQL with Docker..."
    docker-compose up postgres -d
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ PostgreSQL started with Docker${NC}"
        echo "⏳ Waiting for PostgreSQL to be ready..."
        sleep 10
    else
        echo -e "${RED}❌ Failed to start PostgreSQL with Docker${NC}"
        echo "Please ensure PostgreSQL is running manually"
    fi
else
    echo -e "${YELLOW}⚠️  Docker not available. Please ensure PostgreSQL is running on localhost:5432${NC}"
    echo "Database: expense_tracker"
    echo "Username: postgres"
    echo "Password: postgres"
fi

# Setup database
echo "🗄️ Setting up database..."
cd apps/backend

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to generate Prisma client${NC}"
    exit 1
fi

# Run migrations
echo "Running database migrations..."
npx prisma migrate dev --name init

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database setup completed${NC}"
else
    echo -e "${RED}❌ Database migration failed${NC}"
    echo "Please check your PostgreSQL connection and try again"
    exit 1
fi

cd ../..

# Test Turborepo integration
echo "🧪 Testing Turborepo integration..."

if npx turbo build --help > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Turborepo integration working${NC}"
else
    echo -e "${YELLOW}⚠️  Turborepo test failed, but should work when starting${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Setup completed successfully!${NC}"
echo ""
echo -e "${BLUE}🚀 Starting the application with Turborepo:${NC}"
echo "   ${YELLOW}npm run dev${NC}                    # Start both frontend and backend"
echo "   ${YELLOW}npm run dev:backend${NC}            # Start only backend"
echo "   ${YELLOW}npm run dev:frontend${NC}           # Start only frontend"
echo ""
echo -e "${BLUE}📱 Application URLs:${NC}"
echo "   Frontend: ${YELLOW}http://localhost:3000${NC}"
echo "   Backend:  ${YELLOW}http://localhost:3001${NC}"
echo "   API Docs: ${YELLOW}http://localhost:3001/api${NC}"
echo ""
echo -e "${BLUE}🗄️ Database management:${NC}"
echo "   ${YELLOW}npm run db:studio${NC}              # Open Prisma Studio"
echo "   ${YELLOW}npm run db:migrate${NC}             # Run migrations"
echo ""
echo -e "${BLUE}🌪️ Turborepo commands:${NC}"
echo "   ${YELLOW}turbo build${NC}                    # Build all apps"
echo "   ${YELLOW}turbo lint${NC}                     # Lint all apps"
echo "   ${YELLOW}turbo test${NC}                     # Test all apps"
echo ""
echo -e "${BLUE}🛠️ NestJS CLI commands (from apps/backend):${NC}"
echo "   ${YELLOW}cd apps/backend${NC}"
echo "   ${YELLOW}npx nest generate controller auth${NC}   # Generate controller"
echo "   ${YELLOW}npx nest generate service users${NC}     # Generate service"
echo "   ${YELLOW}npx nest generate module shared${NC}     # Generate module"
echo ""
echo -e "${BLUE}🔧 Troubleshooting:${NC}"
echo "   ${YELLOW}cd apps/backend && npm run check-env${NC} # Debug environment variables"
echo "   ${YELLOW}cat PORT_TROUBLESHOOTING.md${NC}         # Port configuration help"
echo ""
echo -e "${YELLOW}💡 First time? Create an account at http://localhost:3000/register${NC}"
echo -e "${YELLOW}📖 Read NESTJS_CLI_INTEGRATION.md for detailed CLI usage${NC}"