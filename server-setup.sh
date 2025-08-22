#!/bin/bash

# Server Setup Script for AI Chatbot
# Run this script on a fresh Ubuntu/Debian VPS

set -e

echo "🚀 Starting server setup for AI Chatbot..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential packages
echo "📦 Installing essential packages..."
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Install Node.js 18+
echo "📦 Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
echo "📦 Installing pnpm..."
npm install -g pnpm

# Install PostgreSQL
echo "📦 Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Install Redis
echo "📦 Installing Redis..."
sudo apt install -y redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Install Nginx
echo "📦 Installing Nginx..."
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Install PM2
echo "📦 Installing PM2..."
npm install -g pm2

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/ai-chatbot
sudo chown $USER:$USER /var/www/ai-chatbot

# Create PM2 log directory
echo "📁 Creating PM2 log directory..."
sudo mkdir -p /var/log/pm2
sudo chown $USER:$USER /var/log/pm2

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Install Certbot for SSL (optional)
echo "🔒 Installing Certbot for SSL..."
sudo apt install -y certbot python3-certbot-nginx

# Create database and user
echo "🗄️ Setting up PostgreSQL database..."
sudo -u postgres psql -c "CREATE DATABASE ai_chatbot;" || echo "Database might already exist"
sudo -u postgres psql -c "CREATE USER chatbot_user WITH PASSWORD 'your_secure_password';" || echo "User might already exist"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ai_chatbot TO chatbot_user;" || echo "Privileges might already be granted"

echo "✅ Server setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Clone your repository: cd /var/www/ai-chatbot && git clone <your-repo> ."
echo "2. Configure environment variables: cp .env.example .env.local && nano .env.local"
echo "3. Install dependencies: pnpm install"
echo "4. Build application: pnpm run build"
echo "5. Start with PM2: pm2 start ecosystem.config.js --env production"
echo "6. Configure Nginx: sudo cp nginx.conf /etc/nginx/sites-available/ai-chatbot"
echo "7. Enable site: sudo ln -s /etc/nginx/sites-available/ai-chatbot /etc/nginx/sites-enabled/"
echo "8. Test and reload Nginx: sudo nginx -t && sudo systemctl reload nginx"
echo ""
echo "🔧 Useful commands:"
echo "- Check PM2 status: pm2 list"
echo "- View logs: pm2 logs ai-chatbot"
echo "- Monitor: pm2 monit"
echo "- Restart app: pm2 restart ai-chatbot"
echo "- Nginx status: sudo systemctl status nginx"
echo "- Nginx logs: sudo tail -f /var/log/nginx/error.log"
