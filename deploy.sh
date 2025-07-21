#!/bin/bash

# Expense Tracker Deployment Script for Digital Ocean
# Usage: ./deploy.sh [--ssl]

set -e

echo "🚀 Starting deployment of Expense Tracker..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "docker-compose.prod.yml" ]; then
    echo -e "${RED}Error: docker-compose.prod.yml not found. Are you in the project root?${NC}"
    exit 1
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Warning: .env file not found. Creating from template...${NC}"
    cp .env.production .env
    echo -e "${RED}Please edit .env with your actual values before continuing.${NC}"
    echo "Required variables: POSTGRES_PASSWORD, JWT_SECRET"
    exit 1
fi

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Build and start services
echo "🔨 Building and starting services..."
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Run database migrations
echo "🗄️ Running database migrations..."
docker-compose -f docker-compose.prod.yml exec -T backend npx prisma migrate deploy

# Health check
echo "🩺 Performing health check..."
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Application is healthy!${NC}"
else
    echo -e "${RED}❌ Health check failed. Check logs:${NC}"
    docker-compose -f docker-compose.prod.yml logs
    exit 1
fi

# SSL setup if requested
if [ "$1" = "--ssl" ]; then
    echo "🔒 Setting up SSL with Let's Encrypt..."
    if command -v certbot &> /dev/null; then
        echo "Please enter your domain name:"
        read -r DOMAIN
        certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --email admin@"$DOMAIN"
        echo -e "${GREEN}✅ SSL certificate installed!${NC}"
    else
        echo -e "${YELLOW}Certbot not found. Install with: apt install certbot python3-certbot-nginx${NC}"
    fi
fi

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo "📋 Next steps:"
echo "1. Visit your application: http://$(curl -s ifconfig.me)"
echo "2. Check API docs: http://$(curl -s ifconfig.me)/api"
echo "3. Monitor logs: docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo "🔧 Management commands:"
echo "  Start:   docker-compose -f docker-compose.prod.yml up -d"
echo "  Stop:    docker-compose -f docker-compose.prod.yml down"
echo "  Logs:    docker-compose -f docker-compose.prod.yml logs -f"
echo "  Update:  ./deploy.sh"