#!/bin/bash

# Subdomain Deployment Script for budget.alfcs.dev
# This script deploys the expense tracker as a subdomain alongside existing sites

set -e

echo "🚀 Deploying Expense Tracker to budget.alfcs.dev..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/home/alfredocs/budget-app"
MAIN_DOMAIN="alfcs.dev"
SUBDOMAIN="budget.alfcs.dev"
NGINX_CONFIG_DIR="/etc/nginx"
MAIN_SITE_DIR="/home/alfredocs/dev/alfcs.dev"

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}❌ This script must be run as root${NC}"
   exit 1
fi

echo "📋 Checking prerequisites..."

# Check required tools
REQUIRED_TOOLS=("docker" "docker-compose" "nginx" "git" "curl")
for tool in "${REQUIRED_TOOLS[@]}"; do
    if ! command -v "$tool" >/dev/null 2>&1; then
        echo -e "${RED}❌ $tool is not installed${NC}"
        exit 1
    fi
done

echo -e "${GREEN}✅ Prerequisites check completed${NC}"

# Create application directory
echo "📁 Setting up expense tracker directory..."
mkdir -p "$APP_DIR"
mkdir -p "$APP_DIR/backups"
mkdir -p "$APP_DIR/logs"

# Clone or update repository
echo "📥 Setting up application code..."
if [ -d "$APP_DIR/.git" ]; then
    echo "Updating existing repository..."
    cd "$APP_DIR"
    git pull origin main
else
    echo "Cloning repository..."
    # Replace with your actual repository URL
    git clone https://github.com/alfcs-dev/budget-app.git "$APP_DIR"
    cd "$APP_DIR"
fi

# Setup environment file
echo "🔧 Setting up environment variables..."
if [ ! -f "$APP_DIR/.env" ]; then
    echo "Creating .env file for subdomain..."
    cat > "$APP_DIR/.env" << EOF
# Database Configuration
DATABASE_URL=postgresql://postgres:$(openssl rand -base64 32 | tr -d '/')@postgres:5432/expense_tracker?schema=public
POSTGRES_DB=expense_tracker
POSTGRES_USER=postgres
POSTGRES_PASSWORD=$(openssl rand -base64 32 | tr -d '/')

# Application Configuration
NODE_ENV=production
JWT_SECRET=$(openssl rand -base64 64 | tr -d '/')

# Subdomain Configuration
FRONTEND_URL=https://budget.alfcs.dev
BACKEND_URL=https://budget.alfcs.dev/api
VITE_API_URL=/api

# Domain Configuration
MAIN_DOMAIN=alfcs.dev
SUBDOMAIN=budget.alfcs.dev
EOF
    
    echo -e "${YELLOW}⚠️  Environment file created with random passwords.${NC}"
    echo "✅ File location: $APP_DIR/.env"
else
    echo -e "${GREEN}✅ Environment file already exists${NC}"
fi

# Load environment variables
source "$APP_DIR/.env"

# Update nginx configuration
echo "🌐 Configuring Nginx for subdomain..."

# Ensure sites-available and sites-enabled directories exist
mkdir -p "$NGINX_CONFIG_DIR/sites-available"
mkdir -p "$NGINX_CONFIG_DIR/sites-enabled"

# Backup existing nginx config
if [ -f "$NGINX_CONFIG_DIR/nginx.conf" ]; then
    cp "$NGINX_CONFIG_DIR/nginx.conf" "$NGINX_CONFIG_DIR/nginx.conf.backup.$(date +%Y%m%d_%H%M%S)"
    echo "✅ Nginx config backed up"
fi

# Create subdomain-only configuration file
echo "Creating subdomain nginx configuration..."
cat > "$NGINX_CONFIG_DIR/sites-available/budget.alfcs.dev" << 'EOF'
# Rate limiting zones (define once)
limit_req_zone $binary_remote_addr zone=expense_api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=expense_auth:10m rate=5r/s;

# Subdomain: budget.alfcs.dev (Expense Tracker)
server {
    listen 80;
    server_name budget.alfcs.dev;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # API routes - proxy to expense tracker backend
    location /api/ {
        limit_req zone=expense_api burst=20 nodelay;
        
        proxy_pass http://localhost:3011;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Auth routes with stricter rate limiting
    location /api/auth/ {
        limit_req zone=expense_auth burst=5 nodelay;
        
        proxy_pass http://localhost:3011;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend - proxy to expense tracker frontend
    location / {
        proxy_pass http://localhost:3010;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check
    location /health {
        access_log off;
        return 200 "budget.alfcs.dev healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Enable the site
ln -sf "$NGINX_CONFIG_DIR/sites-available/budget.alfcs.dev" "$NGINX_CONFIG_DIR/sites-enabled/"

echo -e "${GREEN}✅ Subdomain nginx configuration created${NC}"
echo -e "${YELLOW}⚠️  You may need to include sites-enabled/* in your main nginx.conf${NC}"

# Test nginx configuration
if nginx -t; then
    echo -e "${GREEN}✅ Nginx configuration is valid${NC}"
    systemctl reload nginx
else
    echo -e "${RED}❌ Nginx configuration error${NC}"
    exit 1
fi

# Start expense tracker services
echo "🐳 Starting expense tracker services..."

# Stop existing services if running
docker-compose -f docker-compose.subdomain.yml down 2>/dev/null || true

# Start new services
docker-compose -f docker-compose.subdomain.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Run database migrations
echo "🗄️ Running database migrations..."
docker-compose -f docker-compose.subdomain.yml exec -T backend npx prisma migrate deploy

# Setup SSL for subdomain
if [ "$1" = "--ssl" ]; then
    echo "🔒 Setting up SSL for subdomain..."
    
    # Install certbot if not installed
    if ! command -v certbot >/dev/null 2>&1; then
        apt update
        apt install -y certbot python3-certbot-nginx
    fi
    
    # Generate SSL certificate for subdomain
    certbot --nginx -d budget.alfcs.dev --email admin@alfcs.dev --agree-tos --non-interactive
    
    echo -e "${GREEN}✅ SSL certificate configured for budget.alfcs.dev${NC}"
else
    echo -e "${YELLOW}⚠️  Skipping SSL setup (use --ssl flag to enable)${NC}"
fi

# Health checks
echo "🔍 Running health checks..."

# Check if main site is still working
if curl -f http://alfcs.dev >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Main site (alfcs.dev) is still working${NC}"
else
    echo -e "${YELLOW}⚠️  Main site health check failed${NC}"
fi

# Check expense tracker containers directly first
echo "Checking containers directly..."
for i in {1..5}; do
    if curl -f http://localhost:3010/health >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend container health check passed${NC}"
        break
    fi
    echo "Waiting for frontend container... ($i/5)"
    sleep 5
done

for i in {1..5}; do
    if curl -f http://localhost:3011/api/health >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend container health check passed${NC}"
        break
    fi
    echo "Waiting for backend container... ($i/5)"
    sleep 5
done

# Check through subdomain (requires DNS)
echo "Checking through subdomain (may fail if DNS not configured)..."
if curl -f http://budget.alfcs.dev/health >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Subdomain frontend health check passed${NC}"
else
    echo -e "${YELLOW}⚠️  Subdomain frontend check failed (DNS may not be configured yet)${NC}"
fi

if curl -f http://budget.alfcs.dev/api/health >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Subdomain API health check passed${NC}"
else
    echo -e "${YELLOW}⚠️  Subdomain API check failed (DNS may not be configured yet)${NC}"
fi

# Setup systemd service for auto-start
echo "⚙️ Setting up auto-start service..."
cat > /etc/systemd/system/expense-tracker.service << EOF
[Unit]
Description=Expense Tracker Docker Compose
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$APP_DIR
ExecStart=/usr/local/bin/docker-compose -f docker-compose.subdomain.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.subdomain.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

systemctl enable expense-tracker.service
systemctl start expense-tracker.service

echo ""
echo -e "${GREEN}🎉 Subdomain deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}📱 Application URLs:${NC}"
echo "   🌐 Main site: https://alfcs.dev (unchanged)"
if [ "$1" = "--ssl" ]; then
    echo "   💰 Expense Tracker: https://budget.alfcs.dev"
    echo "   🔌 API: https://budget.alfcs.dev/api"
else
    echo "   💰 Expense Tracker: http://budget.alfcs.dev"
    echo "   🔌 API: http://budget.alfcs.dev/api"
fi
echo ""
echo -e "${BLUE}🔧 Management Commands:${NC}"
echo "   📊 View logs: docker-compose -f $APP_DIR/docker-compose.subdomain.yml logs -f"
echo "   🔄 Restart: systemctl restart expense-tracker"
echo "   🛑 Stop: systemctl stop expense-tracker"
echo "   💾 Backup DB: cd $APP_DIR && docker-compose -f docker-compose.subdomain.yml exec postgres pg_dump -U postgres expense_tracker > backup.sql"
echo ""
echo -e "${BLUE}📂 Important Files:${NC}"
echo "   🔧 Environment: $APP_DIR/.env"
echo "   🌐 Nginx Config: /etc/nginx/sites-available/budget.alfcs.dev"
echo "   📝 Logs: $APP_DIR/logs/"
echo "   💾 Backups: $APP_DIR/backups/"
echo ""
echo -e "${YELLOW}💡 Next Steps:${NC}"
echo "   1. Add DNS A record: budget.alfcs.dev → $(curl -s ifconfig.me)"
echo "   2. Test both sites work correctly"
echo "   3. Run with --ssl flag to enable HTTPS"
echo "   4. Setup monitoring for both applications"