# Generix.app Docker Deployment Guide

## 🏠 Home Server Setup for Ubuntu 22.04

Complete guide to deploy Generix.app on your home Ubuntu server using Docker.

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

### 2. Port Forwarding on Router

Forward these ports to your server's local IP:
- **Port 80** (HTTP) → Required for initial setup and Let's Encrypt
- **Port 443** (HTTPS) → Required for SSL/HTTPS traffic

### 3. Domain Setup (Optional but Recommended)

If you have a domain:
1. Create an **A record** pointing to your public IP
2. Create a **www** CNAME pointing to your domain
3. Wait for DNS propagation (can take up to 24 hours)

You can use free dynamic DNS services like:
- DuckDNS (duckdns.org)
- No-IP (noip.com)
- Dynu (dynu.com)

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
# Build images
docker compose build

# Start database
docker compose up -d db

# Wait for database
sleep 10

# Run migrations
docker compose run --rm backend python manage.py migrate

# Create superuser
docker compose run --rm backend python manage.py createsuperuser

# Start all services
docker compose up -d
```

#### Step 4: Obtain SSL Certificate (Optional)

```bash
# Make sure DOMAIN points to your server
# Then run:
docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email \
  -d yourdomain.com \
  -d www.yourdomain.com

# After successful certificate:
# 1. Update nginx configuration
envsubst '${DOMAIN}' < nginx/conf.d/generix.conf.template > nginx/conf.d/generix.conf
rm nginx/conf.d/default.conf

# 2. Reload nginx
docker compose restart nginx
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
docker compose exec db psql -U generix_user -d generix_db

# Backup database
docker compose exec db pg_dump -U generix_user generix_db > backup.sql

# Restore database
docker compose exec -T db psql -U generix_user generix_db < backup.sql
```

### Update Application

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker compose up -d --build

# Run migrations if needed
docker compose run --rm backend python manage.py migrate
```

---

## 📊 Monitoring & Maintenance

### Check Service Status

```bash
docker compose ps
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

Certbot runs automatically every 12 hours to renew certificates.

Manual renewal:
```bash
docker compose run --rm certbot renew
docker compose restart nginx
```

---

## 🔒 Security Best Practices

### 1. Firewall Configuration

```bash
# Install UFW (if not installed)
sudo apt install ufw

# Allow SSH (IMPORTANT - do this first!)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
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
docker compose exec -T db pg_dump -U generix_user generix_db > "$BACKUP_DIR/db_$DATE.sql"

# Backup media files
docker compose exec -T backend tar -czf - /app/mediafiles > "$BACKUP_DIR/media_$DATE.tar.gz"

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
docker compose exec db pg_isready -U generix_user

# Restart database
docker compose restart db

# Check database logs
docker compose logs db
```

### SSL Certificate Issues

```bash
# Test certificate renewal
docker compose run --rm certbot renew --dry-run

# Check certificate expiry
docker compose exec nginx openssl x509 -in /etc/letsencrypt/live/yourdomain.com/fullchain.pem -noout -dates
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

### Local Network Access
- Frontend: `http://your-server-local-ip`
- API: `http://your-server-local-ip/api/`
- Admin: `http://your-server-local-ip/admin/`

### External Access (with domain)
- Frontend: `https://yourdomain.com`
- API: `https://yourdomain.com/api/`
- Admin: `https://yourdomain.com/admin/`

---

## 🔄 Automatic Updates with Watchtower (Optional)

```bash
# Add to docker-compose.yml
docker run -d \
  --name watchtower \
  -v /var/run/docker.sock:/var/run/docker.sock \
  containrrr/watchtower \
  --interval 3600
```

---

## �️ Database Management

### Restore Database from Backup

The project includes a `generix_db_backup.sql` file. To restore it:

1.  **Copy the backup file to the database container:**
    ```bash
    docker cp generix_db_backup.sql generix-db:/tmp/backup.sql
    ```

2.  **Execute the restore command:**
    ```bash
    docker exec -it generix-db psql -U generix_user -d generix_db -f /tmp/backup.sql
    ```

### Create a New Backup

To create a new backup of your running database:

```bash
docker exec -t generix-db pg_dump -U generix_user generix_db > generix_db_backup_new.sql
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

Your Generix.app should now be running on your home server!

**Next Steps:**
1. ✅ Access the admin panel and configure your site
2. ✅ Test all functionality
3. ✅ Set up regular backups
4. ✅ Monitor service logs
5. ✅ Configure email notifications

**Happy hosting! 🚀**
