# 🚀 Deploy Guide - GCP VM

Complete guide to deploy Champions315 API on a GCP VM instance.

## 📋 Prerequisites on VM

### 1. Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Docker & Docker Compose
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group (no need for sudo)
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose -y

# Restart session or run:
newgrp docker

# Verify installation
docker --version
docker-compose --version
```

### 3. Install Git (if not installed)
```bash
sudo apt install git -y
```

### 4. (Optional) Install Node.js (for local development/testing)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version
npm --version
```

## 🔧 Deployment Steps

### 1. Clone Repository
```bash
cd ~
git clone <your-repository-url>
cd champions315api
```

### 2. Configure Environment Variables
```bash
# Create .env file
nano .env
```

Add your production environment variables:
```env
# Database
DATABASE_URL="postgresql://docker:docker@postgres:5432/champions315apidb"
DB_USER=docker
DB_PASSWORD=your_secure_password_here
DB_NAME=champions315apidb

# Application
NODE_ENV=production
PORT=3000
```

**Important:** Change `DB_PASSWORD` to a secure password!

### 3. Build and Run with Docker Compose

#### Option A: Production with Compose (Recommended for VM)
```bash
# Build and start services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check status
docker-compose -f docker-compose.prod.yml ps
```

#### Option B: Development Mode
```bash
# Start only database
docker-compose up -d

# Install dependencies
npm install

# Run migrations
npx prisma migrate deploy

# Start application
npm run start:dev
```

### 4. Configure GCP Firewall

Allow external traffic to your application:

**Via GCP Console:**
1. Go to VPC Network → Firewall
2. Create Firewall Rule:
    - Name: `allow-champions315-api`
   - Direction: Ingress
   - Targets: All instances (or specific tags)
   - Source: 0.0.0.0/0
   - Protocols/Ports: tcp:3000
   - Action: Allow

**Via gcloud CLI:**
```bash
gcloud compute firewall-rules create allow-champions315-api \
    --allow tcp:3000 \
    --source-ranges 0.0.0.0/0 \
    --description "Allow Champions315 API"
```

### 5. Test Application
```bash
# Get VM external IP
curl ifconfig.me

# Test from local machine
curl http://YOUR_VM_EXTERNAL_IP:3000/health
```

## 🔄 Useful Commands

### Docker Compose Management
```bash
# Stop services
docker-compose -f docker-compose.prod.yml down

# Restart services
docker-compose -f docker-compose.prod.yml restart

# View logs
docker-compose -f docker-compose.prod.yml logs -f app

# Rebuild after code changes
docker-compose -f docker-compose.prod.yml up -d --build
```

### Update Application
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build

# Run new migrations
docker-compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
```

### Database Management
```bash
# Access PostgreSQL
docker-compose -f docker-compose.prod.yml exec postgres psql -U docker -d champions315apidb

# Backup database
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U docker champions315apidb > backup.sql

# Restore database
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U docker champions315apidb < backup.sql
```

## 🌐 (Optional) Setup Nginx Reverse Proxy

For production, it's recommended to use Nginx as reverse proxy:

### 1. Install Nginx
```bash
sudo apt install nginx -y
```

### 2. Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/champions315-api
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;  # or VM external IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3. Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/champions315-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. Update Firewall
```bash
# Allow HTTP (port 80)
gcloud compute firewall-rules create allow-http \
    --allow tcp:80 \
    --source-ranges 0.0.0.0/0
```

## 🔒 (Optional) SSL with Let's Encrypt

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is configured automatically
sudo certbot renew --dry-run
```

## 📊 Monitoring

### View Application Logs
```bash
docker-compose -f docker-compose.prod.yml logs -f app
```

### System Resources
```bash
# Check disk space
df -h

# Check memory
free -h

# Check running containers
docker ps

# Container stats
docker stats
```

## 🔄 Auto-start on Reboot

Docker Compose services with `restart: unless-stopped` will automatically start on reboot.

Verify:
```bash
sudo systemctl enable docker
```

## 🛠️ Troubleshooting

### Application not responding
```bash
# Check if containers are running
docker ps

# Check logs
docker-compose -f docker-compose.prod.yml logs app

# Restart services
docker-compose -f docker-compose.prod.yml restart
```

### Database connection issues
```bash
# Check if PostgreSQL is running
docker-compose -f docker-compose.prod.yml ps postgres

# Check database logs
docker-compose -f docker-compose.prod.yml logs postgres

# Verify DATABASE_URL in .env
```

### Port already in use
```bash
# Check what's using port 3000
sudo lsof -i :3000

# Kill process if needed
sudo kill -9 <PID>
```

## 📝 Quick Deploy Summary

```bash
# One-time setup
sudo apt update && sudo apt upgrade -y
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh
sudo usermod -aG docker $USER
sudo apt install docker-compose git -y
newgrp docker

# Deploy application
git clone <repo-url>
cd champions315api
nano .env  # Configure environment variables
docker-compose -f docker-compose.prod.yml up -d

# Configure GCP firewall (via console or gcloud)
gcloud compute firewall-rules create allow-champions315-api --allow tcp:3000 --source-ranges 0.0.0.0/0

# Test
curl http://$(curl -s ifconfig.me):3000/health
```

---

✅ Your API is now running in production on GCP!
