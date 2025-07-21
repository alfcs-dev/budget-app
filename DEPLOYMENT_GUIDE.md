# 🚀 Digital Ocean Deployment Guide

## ✅ **Complete Deployment Checklist**

Your expense tracker application now has **everything needed** for production deployment to Digital Ocean on the same domain! Here's what we've included:

### **📦 Production Files Added**

| File | Purpose | Status |
|------|---------|--------|
| `apps/backend/Dockerfile` | Production backend container | ✅ Complete |
| `apps/frontend/Dockerfile` | Production frontend container | ✅ Complete |
| `nginx/frontend.conf` | Frontend web server config | ✅ Complete |
| `docker-compose.prod.yml` | Production orchestration | ✅ Complete |
| `nginx/nginx.conf` | Reverse proxy configuration | ✅ Complete |
| `.env.production` | Production environment template | ✅ Complete |
| `deploy.sh` | Automated deployment script | ✅ Complete |
| `.github/workflows/deploy.yml` | CI/CD pipeline | ✅ Complete |

## 🎯 **Architecture Overview**

```
Internet → Digital Ocean Droplet
    ↓
[Nginx Reverse Proxy] (Port 80/443)
    ├── / → [React Frontend Container]
    └── /api → [NestJS Backend Container]
                   ↓
            [PostgreSQL Container]
```

**Benefits:**
- ✅ **Same Domain**: Frontend and API on one domain (no CORS issues)
- ✅ **SSL Ready**: Automatic HTTPS with Let's Encrypt
- ✅ **Auto-Deploy**: Push to GitHub → auto-deploys to Digital Ocean
- ✅ **Health Monitoring**: Automatic health checks and restarts
- ✅ **Database Backups**: Daily automated backups
- ✅ **Security**: Rate limiting, security headers, firewall ready

## 🏗️ **First Time Setup (Required)**

Before deploying, you need to prepare your Digital Ocean droplet. This is a **one-time setup**.

### **Step 1: Create Digital Ocean Droplet**

1. **Create a new droplet:**
   - Ubuntu 22.04 LTS (recommended)
   - Minimum: 2 GB RAM, 1 vCPU, 50 GB SSD
   - Recommended: 4 GB RAM, 2 vCPU, 80 GB SSD

2. **Configure SSH access:**
   ```bash
   # Test SSH connection
   ssh root@your.droplet.ip.address
   ```

### **Step 2: Install Docker & Dependencies**

Run these commands on your droplet:

```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Verify installations
docker --version
docker-compose --version

# Install git and other utilities
apt install -y git curl nano htop ufw

# Setup firewall
ufw allow ssh
ufw allow 80
ufw allow 443
ufw --force enable
```

### **Step 3: Clone Your Repository**

```bash
# Create app directory
mkdir -p /var/www/expense-tracker
cd /var/www/expense-tracker

# Clone your repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git .

# Make deploy script executable
chmod +x deploy.sh
```

### **Step 4: Configure Environment**

```bash
# Copy environment template
cp .env.production .env

# Edit environment file
nano .env
```

**Required values to update in .env:**
```bash
# Generate a secure password (use: openssl rand -base64 32)
POSTGRES_PASSWORD=your_generated_secure_password_here

# Generate JWT secret (use: openssl rand -base64 64)
JWT_SECRET=your_generated_jwt_secret_here

# Update with your domain (optional for IP-based access)
FRONTEND_URL=https://your-domain.com
```

### **Step 5: Initial Database Setup**

```bash
# Start only the database first
docker-compose -f docker-compose.prod.yml up -d postgres

# Wait for database to be ready (about 30 seconds)
sleep 30

# Check database health
docker-compose -f docker-compose.prod.yml logs postgres

# The database is ready when you see: "database system is ready to accept connections"
```

### **Step 6: Run Initial Migration**

```bash
# Build backend container (needed for migrations)
docker-compose -f docker-compose.prod.yml build backend

# Run database migration to create tables
docker-compose -f docker-compose.prod.yml run --rm backend npx prisma migrate deploy

# Verify migration worked
docker-compose -f docker-compose.prod.yml exec postgres psql -U postgres -d expense_tracker -c "\dt"
```

You should see output showing your database tables (users, accounts, categories, etc.).

### **Step 7: First Deployment**

```bash
# Now start all services
docker-compose -f docker-compose.prod.yml up -d

# Check all services are running
docker-compose -f docker-compose.prod.yml ps

# View logs to ensure everything started correctly
docker-compose -f docker-compose.prod.yml logs -f
```

### **Step 8: Verify Deployment**

```bash
# Test health endpoints
curl http://localhost/health
curl http://localhost/api/health

# Check your external IP
curl -4 ifconfig.me

# Your app should be accessible at: http://YOUR_DROPLET_IP
```

**🎉 First time setup complete!** Your expense tracker is now running.

---

## 🚀 **Deployment Methods (After Initial Setup)**

Once you've completed the first-time setup above, you can use these methods for updates:

### **Method 1: Automated CI/CD (Recommended)**

1. **Setup GitHub Secrets:**
   ```bash
   # In your GitHub repo settings → Secrets and variables → Actions:
   DO_HOST=your.droplet.ip.address
   DO_USERNAME=root
   DO_PRIVATE_KEY=your_ssh_private_key
   DO_PORT=22
   GITHUB_TOKEN=automatically_provided
   ```

2. **Initial Droplet Setup:**
   ```bash
   # SSH into your droplet
   ssh root@your.droplet.ip.address
   
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # Install Docker Compose
   curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   chmod +x /usr/local/bin/docker-compose
   
   # Create app directory
   mkdir -p /var/www/expense-tracker
   cd /var/www/expense-tracker
   
   # Clone your repository
   git clone YOUR_GITHUB_REPO_URL .
   
   # Setup environment
   cp .env.production .env
   # Edit .env with your actual values
   nano .env
   ```

3. **Deploy:**
   ```bash
   # Just push to main branch!
   git push origin main
   # GitHub Actions will automatically deploy
   ```

### **Method 2: Manual Deployment**

```bash
# On your Digital Ocean droplet
wget https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/deploy.sh
chmod +x deploy.sh

# Deploy without SSL
./deploy.sh

# Deploy with SSL (recommended)
./deploy.sh --ssl
```

## 🔧 **Environment Configuration**

### **Required Environment Variables**

Copy `.env.production` to `.env` on your droplet and update:

```bash
# Database (use strong passwords!)
POSTGRES_PASSWORD=your_very_secure_password_here
JWT_SECRET=your_super_secure_jwt_secret_at_least_32_characters_long

# Domain configuration
FRONTEND_URL=https://your-domain.com
# Replace your-domain.com with your actual domain

# Database URL (automatically set from POSTGRES_PASSWORD)
DATABASE_URL=postgresql://postgres:your_very_secure_password_here@postgres:5432/expense_tracker?schema=public
```

### **Domain Configuration**

1. **Point your domain to Digital Ocean:**
   - Add A record: `your-domain.com → your.droplet.ip.address`
   - Add CNAME record: `www.your-domain.com → your-domain.com`

2. **Update configuration files:**
   ```bash
   # In nginx/nginx.conf, replace:
   server_name your-domain.com;
   # With your actual domain
   ```

## 🔒 **SSL/HTTPS Setup**

### **Automatic SSL with Let's Encrypt:**

```bash
# During deployment
./deploy.sh --ssl

# Or manually after deployment
certbot --nginx -d your-domain.com -d www.your-domain.com
```

### **Manual SSL Certificate:**

If you have your own SSL certificate:

```bash
# Copy certificates to nginx/ssl/
cp your_cert.pem /var/www/expense-tracker/nginx/ssl/fullchain.pem
cp your_key.pem /var/www/expense-tracker/nginx/ssl/privkey.pem

# Update nginx config to enable SSL
nano /var/www/expense-tracker/nginx/nginx.conf
# Uncomment SSL lines
```

## 📊 **Monitoring & Maintenance**

### **Health Checks**

Built-in health monitoring:
```bash
# Check application health
curl https://your-domain.com/health
curl https://your-domain.com/api

# View service status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### **Database Backups**

Automatic daily backups at 2 AM:
```bash
# Manual backup
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres expense_tracker > backup.sql

# Restore from backup
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U postgres expense_tracker < backup.sql
```

### **Updates**

```bash
# Automatic via GitHub Actions
git push origin main

# Manual update
cd /var/www/expense-tracker
git pull origin main
docker-compose -f docker-compose.prod.yml up -d --build
```

## 🛡️ **Security Features**

### **Built-in Security:**

✅ **Rate Limiting**: API and auth endpoints protected  
✅ **Security Headers**: XSS, CSRF, content-type protection  
✅ **HTTPS Redirect**: Automatic SSL redirect  
✅ **Input Validation**: Backend validation on all inputs  
✅ **JWT Authentication**: Secure token-based auth  
✅ **Password Hashing**: bcrypt with salt  
✅ **CORS Protection**: Configured for your domain only  

### **Additional Security Recommendations:**

```bash
# Setup firewall
ufw enable
ufw allow ssh
ufw allow 80
ufw allow 443

# Auto-security updates
apt install unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades

# Fail2ban for SSH protection
apt install fail2ban
```

## 🔧 **Management Commands**

### **Service Management:**

```bash
cd /var/www/expense-tracker

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Stop services
docker-compose -f docker-compose.prod.yml down

# Restart specific service
docker-compose -f docker-compose.prod.yml restart backend

# View logs
docker-compose -f docker-compose.prod.yml logs -f backend

# Execute commands in containers
docker-compose -f docker-compose.prod.yml exec backend npx prisma studio
```

### **Database Management:**

```bash
# Access database
docker-compose -f docker-compose.prod.yml exec postgres psql -U postgres expense_tracker

# Run migrations
docker-compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy

# Generate Prisma client
docker-compose -f docker-compose.prod.yml exec backend npx prisma generate

# Database backup
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres expense_tracker > backup_$(date +%Y%m%d).sql
```

## 🚨 **Troubleshooting**

### **Common Issues:**

**Issue: Services won't start**
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Check environment
cat .env

# Restart everything
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

**Issue: Database connection failed**
```bash
# Check database logs
docker-compose -f docker-compose.prod.yml logs postgres

# Test connection
docker-compose -f docker-compose.prod.yml exec postgres psql -U postgres -d expense_tracker -c "SELECT 1;"
```

**Issue: Frontend not loading**
```bash
# Check nginx logs
docker-compose -f docker-compose.prod.yml logs nginx

# Test nginx config
docker-compose -f docker-compose.prod.yml exec nginx nginx -t
```

### **Performance Monitoring:**

```bash
# System resources
htop
df -h
free -h

# Docker resources
docker stats

# Application performance
curl -w "@curl-format.txt" -o /dev/null -s https://your-domain.com/
```

## 🎯 **Success Verification**

After deployment, verify everything works:

1. **✅ Frontend**: Visit `https://your-domain.com`
2. **✅ API Docs**: Visit `https://your-domain.com/api`
3. **✅ Authentication**: Register and login
4. **✅ Database**: Create test expense
5. **✅ SSL**: Check green lock icon
6. **✅ Mobile**: Test on phone

## 📞 **Support & Maintenance**

### **Log Locations:**
- **Application Logs**: `docker-compose logs`
- **Nginx Logs**: `/var/www/expense-tracker/logs/nginx/`
- **System Logs**: `/var/log/`

### **Backup Strategy:**
- **Database**: Daily automatic backups
- **Application**: Git repository
- **Environment**: Manual `.env` backup
- **SSL Certificates**: Auto-renewed by certbot

### **Update Strategy:**
- **Code**: Automatic via GitHub Actions
- **Dependencies**: Regular security updates
- **System**: Automatic security patches
- **Database**: Migration-based updates

## 🎉 **You're Ready to Deploy!**

Everything is configured for a production-ready deployment:

✅ **Containerized Applications**  
✅ **Reverse Proxy with SSL**  
✅ **Database with Backups**  
✅ **CI/CD Pipeline**  
✅ **Health Monitoring**  
✅ **Security Hardening**  
✅ **Same Domain Setup**  

Just follow the deployment steps above and your expense tracker will be live on your Digital Ocean droplet! 🚀