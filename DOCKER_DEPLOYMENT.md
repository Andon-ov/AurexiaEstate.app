# Aurexia Estate Docker Deployment Guide

## 🏠 Home Server Setup for Ubuntu 22.04

Complete guide to deploy Aurexia Estate on your home Ubuntu server using Docker.

---

## 📋 Prerequisites

### 1. Install Docker & Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose Plugin
sudo apt-get update
sudo apt-get install docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

### 2. Port Configuration

Aurexia Estate runs on **port 8081** by default (configurable via `AUREXIA_PORT` in `.env`).

If running alongside other apps (e.g., Generix on port 80), no port conflicts.

For external access, forward port 8081 on your router to the server's local IP.

### 3. Domain Setup (Optional)

If you have a domain:
1. Create an **A record** pointing to your public IP
2. Configure a reverse proxy (e.g., Nginx/Caddy) to proxy to port 8081
3. Wait for DNS propagation (can take up to 24 hours)

---

## 🚀 Quick Deployment

### Option 1: Automated Script (Recommended)

```bash
# Make script executable
chmod +x deploy.sh

# Run deployment script
./deploy.sh
```

The script will guide you through:
1. ✅ Prerequisites check
2. 📝 Environment configuration
3. 🏗️ Building Docker images
4. 💾 Database setup
5. 👤 Superuser creation
6. 🔒 SSL certificate setup
7. 🚀 Service startup

---

### Option 2: Manual Deployment

#### Step 1: Configure Environment

```bash
# Copy example environment file
cp .env.production.example .env

# Edit with your values
nano .env
```

**Required values in `.env`:**
```env
# Generate a secret key
SECRET_KEY=use-python-secrets-module-to-generate-this

# Your domain or IP
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com,your-ip-address
CORS_ALLOWED_ORIGINS=https://yourdomain.com

# Database password
POSTGRES_PASSWORD=your-strong-password

# Cloudinary credentials (from cloudinary.com)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Mailjet credentials (from mailjet.com)
MAILJET_API_KEY=your-api-key
MAILJET_API_SECRET=your-api-secret
MAILJET_SENDER_EMAIL=noreply@yourdomain.com
RECIPIENT_EMAIL=your-email@example.com

# For SSL
DOMAIN=yourdomain.com
EMAIL=your-email@example.com
```

#### Step 2: Generate Django Secret Key

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(50))"
```

#### Step 3: Build and Start Services

```bash
# Build and start all services
docker compose up -d --build

# Wait for database to be healthy, then run migrations
docker exec aurexia-backend python manage.py migrate

# Create superuser for Admin panel
docker exec -it aurexia-backend python manage.py createsuperuser
```

---

## 🔧 Service Management

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f nginx
docker compose logs -f db
```

### Start/Stop/Restart

```bash
# Stop all services
docker compose stop

# Start all services
docker compose start

# Restart specific service
docker compose restart backend

# Restart all services
docker compose restart
```

### Access Database

```bash
# PostgreSQL CLI
docker exec -it aurexia-db psql -U postgres -d aurexia_db

# Backup database
docker exec -t aurexia-db pg_dump -U postgres aurexia_db > aurexia_db_backup.sql

# Restore database
docker exec -i aurexia-db psql -U postgres -d aurexia_db < generix_db_backup.sql
```

### Update Application

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker compose up -d --build

# Run migrations if needed
docker exec aurexia-backend python manage.py migrate
```

---

## 📊 Monitoring & Maintenance

### Check Service Status

```bash
docker compose ps

# Expected containers:
# aurexia-db        (postgres:15-alpine)  - Healthy
# aurexia-backend   (python:3.11-slim)    - Running
# aurexia-frontend  (node:20-alpine)      - Running  
# aurexia-nginx     (nginx:alpine)        - Running
```

### Check Resource Usage

```bash
docker stats
```

### Clean Up

```bash
# Remove stopped containers
docker compose down

# Remove everything including volumes (⚠️ DELETES DATA)
docker compose down -v

# Clean unused images
docker image prune -a
```

### SSL Certificate Renewal

> **Note:** SSL/Certbot is not configured in the current setup (HTTP only on port 8081).
> When you get a domain, add certbot service to `docker-compose.yml` and update nginx config.

---

## 🔒 Security Best Practices

### 1. Firewall Configuration

```bash
# Install UFW (if not installed)
sudo apt install ufw

# Allow SSH (IMPORTANT - do this first!)
sudo ufw allow 22/tcp

# Allow Aurexia Estate port
sudo ufw allow 8081/tcp

# If Generix is also running:
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### 2. Secure Your .env File

```bash
# Set proper permissions
chmod 600 .env

# Never commit to git
echo ".env" >> .gitignore
```

### 3. Regular Backups

```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/$USER/backups"
mkdir -p $BACKUP_DIR
DATE=$(date +%Y%m%d_%H%M%S)

# Backup database
docker exec -t aurexia-db pg_dump -U postgres aurexia_db > "$BACKUP_DIR/db_$DATE.sql"

# Backup media files
docker exec aurexia-backend tar -czf - /app/mediafiles > "$BACKUP_DIR/media_$DATE.tar.gz"

echo "Backup completed: $DATE"
EOF

chmod +x backup.sh
```

### 4. Update System Regularly

```bash
sudo apt update && sudo apt upgrade -y
```

---

## 🐛 Troubleshooting

### Service Won't Start

```bash
# Check logs
docker compose logs backend

# Check if port is in use
sudo lsof -i :80
sudo lsof -i :443

# Restart service
docker compose restart backend
```

### Database Connection Issues

```bash
# Check database status
docker exec aurexia-db pg_isready -U postgres

# Restart database
docker compose restart db

# Check database logs
docker compose logs db
```

### Frontend Not Loading

```bash
# Check frontend logs
docker compose logs frontend

# Rebuild frontend
docker compose up -d --build frontend
```

---

## 📱 Access Your Application

### Local Network Access (Home Server: 192.168.1.41)

| Service        | URL                                        |
| -------------- | ------------------------------------------ |
| **Frontend**   | http://192.168.1.41:8081                   |
| **API**        | http://192.168.1.41:8081/api/              |
| **Admin Panel**| http://192.168.1.41:8081/admin/            |

### 🔑 Admin Panel Credentials

| Field      | Value   |
| ---------- | ------- |
| **URL**    | http://192.168.1.41:8081/admin/ |
| **Username** | admin |
| **Password** | admin |

> ⚠️ **Security Note:** Change the admin password for production use!

### External Access (with domain)
- Frontend: `https://yourdomain.com`
- API: `https://yourdomain.com/api/`
- Admin: `https://yourdomain.com/admin/`

---

## 🔄 CI/CD with GitHub Actions

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that auto-deploys on push to `main`.

### Setup GitHub Secrets:

| Secret             | Value               |
| ------------------ | ------------------- |
| `SERVER_HOST`      | 192.168.1.41        |
| `SERVER_USER`      | server              |
| `SSH_PRIVATE_KEY`  | (ed25519 private key) |

### Generate SSH Key on Server:

```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/github_actions  # Copy this to GitHub Secret SSH_PRIVATE_KEY
```

---

## 🗃️ Database Management

### Restore Database from Backup

The project includes a `generix_db_backup.sql` file. To restore it:

```bash
# Copy backup to container
docker cp generix_db_backup.sql aurexia-db:/tmp/backup.sql

# Restore (duplicate key errors are harmless — existing data is skipped)
docker exec -it aurexia-db psql -U postgres -d aurexia_db -f /tmp/backup.sql

# Run migrations after restore
docker exec aurexia-backend python manage.py migrate
```

### Create a New Backup

```bash
docker exec -t aurexia-db pg_dump -U postgres aurexia_db > aurexia_db_backup.sql
```

---

## �📞 Support

If you encounter issues:
1. Check logs: `docker compose logs -f`
2. Check service status: `docker compose ps`
3. Review this guide
4. Check Docker documentation

---

## 🎉 Success!

Your Aurexia Estate app should now be running on your home server!

**Next Steps:**
1. ✅ Access the admin panel and configure your site
2. ✅ Test all functionality
3. ✅ Set up regular backups
4. ✅ Monitor service logs
5. ✅ Configure email notifications

**Happy hosting! 🚀**
