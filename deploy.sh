#!/bin/bash

# =============================================================================
# GENERIX.APP DEPLOYMENT SCRIPT FOR HOME SERVER
# =============================================================================
# This script sets up the entire Docker environment for production
# =============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "\n${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    print_error "Please do not run this script as root"
    exit 1
fi

print_header "GENERIX.APP DOCKER DEPLOYMENT"

# Step 1: Check prerequisites
print_header "Step 1: Checking Prerequisites"

if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed"
    echo "Install Docker with: curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh"
    exit 1
fi
print_success "Docker is installed"

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    print_error "Docker Compose is not installed"
    echo "Install Docker Compose plugin with: sudo apt-get install docker-compose-plugin"
    exit 1
fi
print_success "Docker Compose is installed"

# Step 2: Environment setup
print_header "Step 2: Setting Up Environment"

if [ ! -f ".env" ]; then
    print_warning ".env file not found in root directory"
    
    # Check if .env exists in backend/
    if [ -f "backend/.env" ]; then
        echo "Found .env in backend/ directory"
        echo "Copying backend/.env to root directory..."
        cp backend/.env .env
        print_success ".env file copied from backend/"
    elif [ -f ".env.production.example" ]; then
        echo "Copying .env.production.example to .env"
        cp .env.production.example .env
        print_warning "IMPORTANT: Edit .env file with your actual values before continuing!"
        echo ""
        echo "Press Enter when you're done editing .env, or Ctrl+C to exit..."
        read -r
    else
        print_error "No .env file found!"
        echo "Please create .env file in root directory or backend/ directory"
        exit 1
    fi
else
    print_success ".env file exists"
fi

# Load environment variables
if [ -f ".env" ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Step 3: Validate required environment variables
print_header "Step 3: Validating Configuration"

REQUIRED_VARS=(
    "SECRET_KEY"
    "POSTGRES_PASSWORD"
    "CLOUDINARY_CLOUD_NAME"
    "CLOUDINARY_API_KEY"
    "CLOUDINARY_API_SECRET"
    "MAILJET_API_KEY"
    "MAILJET_API_SECRET"
    "ALLOWED_HOSTS"
)

MISSING_VARS=0
for VAR in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!VAR}" ]; then
        print_error "Missing required variable: $VAR"
        MISSING_VARS=1
    fi
done

if [ $MISSING_VARS -eq 1 ]; then
    print_error "Please set all required variables in .env file"
    exit 1
fi
print_success "All required variables are set"

# Step 4: Create necessary directories
print_header "Step 4: Creating Directories"

mkdir -p nginx/ssl
mkdir -p nginx/conf.d
print_success "Directories created"

# Step 5: Stop existing containers (if any)
print_header "Step 5: Stopping Existing Containers"

if docker ps -a | grep -q generix; then
    docker-compose down
    print_success "Existing containers stopped"
else
    print_warning "No existing containers found"
fi

# Step 6: Build images
print_header "Step 6: Building Docker Images"

print_warning "This may take 5-10 minutes..."
docker-compose build --no-cache
print_success "Images built successfully"

# Step 7: Start database first
print_header "Step 7: Starting Database"

docker-compose up -d db
echo "Waiting for database to be ready..."
sleep 10

# Check database health
if docker-compose exec -T db pg_isready -U ${POSTGRES_USER:-generix_user} > /dev/null 2>&1; then
    print_success "Database is ready"
else
    print_error "Database failed to start"
    docker-compose logs db
    exit 1
fi

# Step 8: Run database migrations
print_header "Step 8: Running Database Migrations"

docker-compose run --rm backend python manage.py migrate --noinput
print_success "Migrations completed"

# Step 9: Create superuser (optional)
print_header "Step 9: Creating Django Superuser (Optional)"

echo "Do you want to create a Django superuser? (y/n)"
read -r CREATE_SUPERUSER

if [ "$CREATE_SUPERUSER" = "y" ] || [ "$CREATE_SUPERUSER" = "Y" ]; then
    docker-compose run --rm backend python manage.py createsuperuser
    print_success "Superuser created"
else
    print_warning "Skipping superuser creation"
fi

# Step 10: Start all services
print_header "Step 10: Starting All Services"

docker-compose up -d
print_success "All services started"

# Step 11: Wait for services to be healthy
print_header "Step 11: Checking Service Health"

echo "Waiting for services to be healthy..."
sleep 15

# Check service status
docker-compose ps

# Step 12: SSL Certificate Setup (optional)
print_header "Step 12: SSL Certificate Setup"

if [ ! -z "$DOMAIN" ]; then
    echo "Do you want to obtain SSL certificates for $DOMAIN? (y/n)"
    read -r SETUP_SSL
    
    if [ "$SETUP_SSL" = "y" ] || [ "$SETUP_SSL" = "Y" ]; then
        print_warning "Make sure your domain $DOMAIN points to this server's IP!"
        echo "Press Enter to continue or Ctrl+C to cancel..."
        read -r
        
        # Obtain certificate
        docker-compose run --rm certbot certonly \
            --webroot \
            --webroot-path=/var/www/certbot \
            --email ${EMAIL} \
            --agree-tos \
            --no-eff-email \
            -d ${DOMAIN} \
            -d www.${DOMAIN}
        
        if [ $? -eq 0 ]; then
            print_success "SSL certificates obtained successfully"
            
            # Update nginx configuration
            print_warning "Switching to HTTPS configuration..."
            envsubst '${DOMAIN}' < nginx/conf.d/generix.conf.template > nginx/conf.d/generix.conf
            rm nginx/conf.d/default.conf
            
            # Reload nginx
            docker-compose restart nginx
            print_success "Nginx reloaded with SSL configuration"
        else
            print_error "Failed to obtain SSL certificates"
            print_warning "Application is running on HTTP only"
        fi
    else
        print_warning "Skipping SSL setup - application running on HTTP"
    fi
else
    print_warning "DOMAIN not set in .env - skipping SSL setup"
fi

# Step 13: Display access information
print_header "Deployment Complete!"

echo -e "${GREEN}Your Generix.app is now running!${NC}\n"

if [ ! -z "$DOMAIN" ] && [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    echo -e "Frontend:     ${BLUE}https://$DOMAIN${NC}"
    echo -e "Backend API:  ${BLUE}https://$DOMAIN/api/${NC}"
    echo -e "Admin Panel:  ${BLUE}https://$DOMAIN/admin/${NC}"
else
    LOCAL_IP=$(hostname -I | awk '{print $1}')
    echo -e "Frontend:     ${BLUE}http://$LOCAL_IP${NC} or ${BLUE}http://localhost${NC}"
    echo -e "Backend API:  ${BLUE}http://$LOCAL_IP/api/${NC} or ${BLUE}http://localhost/api/${NC}"
    echo -e "Admin Panel:  ${BLUE}http://$LOCAL_IP/admin/${NC} or ${BLUE}http://localhost/admin/${NC}"
fi

echo ""
echo -e "${YELLOW}Useful Commands:${NC}"
echo "  View logs:           docker-compose logs -f"
echo "  Stop services:       docker-compose stop"
echo "  Start services:      docker-compose start"
echo "  Restart services:    docker-compose restart"
echo "  Remove everything:   docker-compose down -v"
echo ""

print_success "Deployment completed successfully!"
