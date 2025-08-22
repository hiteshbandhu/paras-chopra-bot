# Deployment Guide: Next.js AI Chatbot on VPS with Nginx and PM2

This guide will help you deploy your Next.js AI chatbot application on a VPS using Nginx as a reverse proxy and PM2 for process management.

## Prerequisites

- Ubuntu/Debian VPS (recommended: Ubuntu 20.04+)
- Root or sudo access
- Domain name (optional but recommended)
- PostgreSQL database (can be local or external)

## Step 1: Server Setup

### 1.1 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Install Node.js and pnpm
```bash
# Install Node.js 18+ (LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Verify installations
node --version
npm --version
pnpm --version
```

### 1.3 Install PostgreSQL (if using local database)
```bash
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql
CREATE DATABASE ai_chatbot;
CREATE USER chatbot_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE ai_chatbot TO chatbot_user;
\q
```

### 1.4 Install Redis (if needed)
```bash
sudo apt install redis-server -y
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

## Step 2: Install Nginx

```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Step 3: Install PM2

```bash
npm install -g pm2
```

## Step 4: Deploy Application

### 4.1 Create Application Directory
```bash
sudo mkdir -p /var/www/ai-chatbot
sudo chown $USER:$USER /var/www/ai-chatbot
cd /var/www/ai-chatbot
```

### 4.2 Clone Your Repository
```bash
git clone https://github.com/your-username/paras-chopra-bot.git .
```

### 4.3 Install Dependencies
```bash
pnpm install
```

### 4.4 Environment Configuration
```bash
cp .env.example .env.local
nano .env.local
```

Configure your environment variables:
```env
# Database
POSTGRES_URL=postgresql://chatbot_user:your_secure_password@localhost:5432/ai_chatbot

# NextAuth
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_nextauth_secret_here

# AI Providers (configure as needed)
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key

# Other required environment variables
# Add all necessary API keys and configuration
```

### 4.5 Build Application
```bash
pnpm run build
```

## Step 5: PM2 Configuration

### 5.1 Create PM2 Ecosystem File
```bash
nano ecosystem.config.js
```

Add the following configuration:
```javascript
module.exports = {
  apps: [
    {
      name: 'ai-chatbot',
      script: 'pnpm',
      args: 'start',
      cwd: '/var/www/ai-chatbot',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/pm2/ai-chatbot-error.log',
      out_file: '/var/log/pm2/ai-chatbot-out.log',
      log_file: '/var/log/pm2/ai-chatbot-combined.log',
      time: true,
      max_memory_restart: '1G',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
};
```

### 5.2 Create PM2 Log Directory
```bash
sudo mkdir -p /var/log/pm2
sudo chown $USER:$USER /var/log/pm2
```

### 5.3 Start Application with PM2
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

## Step 6: Nginx Configuration

### 6.1 Create Nginx Site Configuration
```bash
sudo nano /etc/nginx/sites-available/ai-chatbot
```

Add the following configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS (uncomment after SSL setup)
    # return 301 https://$server_name$request_uri;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
        proxy_send_timeout 86400;
    }

    # Static file caching
    location /_next/static {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
}
```

### 6.2 Enable Site and Test Configuration
```bash
sudo ln -s /etc/nginx/sites-available/ai-chatbot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 7: SSL Certificate (Optional but Recommended)

### 7.1 Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 7.2 Obtain SSL Certificate
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 7.3 Auto-renewal
```bash
sudo crontab -e
# Add this line for auto-renewal
0 12 * * * /usr/bin/certbot renew --quiet
```

## Step 8: Firewall Configuration

```bash
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## Step 9: Monitoring and Maintenance

### 9.1 PM2 Commands
```bash
# View running processes
pm2 list

# Monitor processes
pm2 monit

# View logs
pm2 logs ai-chatbot

# Restart application
pm2 restart ai-chatbot

# Stop application
pm2 stop ai-chatbot

# Delete application from PM2
pm2 delete ai-chatbot
```

### 9.2 Nginx Commands
```bash
# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# View logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 9.3 Database Migration (if needed)
```bash
cd /var/www/ai-chatbot
pnpm run db:migrate
```

## Step 10: Deployment Script

Create a deployment script for easy updates:
```bash
nano deploy.sh
```

```bash
#!/bin/bash
cd /var/www/ai-chatbot

echo "Pulling latest changes..."
git pull origin main

echo "Installing dependencies..."
pnpm install

echo "Building application..."
pnpm run build

echo "Running database migrations..."
pnpm run db:migrate

echo "Restarting application..."
pm2 restart ai-chatbot

echo "Deployment completed!"
```

Make it executable:
```bash
chmod +x deploy.sh
```

## Troubleshooting

### Common Issues:

1. **Port 3000 already in use:**
   ```bash
   sudo lsof -i :3000
   sudo kill -9 <PID>
   ```

2. **Permission issues:**
   ```bash
   sudo chown -R $USER:$USER /var/www/ai-chatbot
   ```

3. **Database connection issues:**
   - Check PostgreSQL is running: `sudo systemctl status postgresql`
   - Verify connection string in `.env.local`

4. **Nginx 502 Bad Gateway:**
   - Check if PM2 is running: `pm2 list`
   - Check application logs: `pm2 logs ai-chatbot`

5. **Memory issues:**
   - Monitor memory usage: `pm2 monit`
   - Adjust `max_memory_restart` in ecosystem.config.js

## Security Considerations

1. **Keep system updated:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Regular backups:**
   - Database backups
   - Application code backups
   - Environment configuration backups

3. **Monitor logs regularly:**
   - Nginx access/error logs
   - PM2 application logs
   - System logs

4. **Use strong passwords and API keys**
5. **Enable firewall and limit SSH access**
6. **Regular security audits**

## Performance Optimization

1. **Enable Nginx caching for static assets**
2. **Use CDN for static files**
3. **Optimize database queries**
4. **Monitor and adjust PM2 cluster settings**
5. **Enable compression and minification**

This deployment setup provides a robust, scalable foundation for your Next.js AI chatbot application with proper process management, reverse proxy, and monitoring capabilities.
