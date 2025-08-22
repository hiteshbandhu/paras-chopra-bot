#!/bin/bash

# Deployment script for AI Chatbot
# Make sure to run this from the application directory

set -e  # Exit on any error

echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the application root directory."
    exit 1
fi

# Pull latest changes
echo "📥 Pulling latest changes from git..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build application
echo "🔨 Building application..."
pnpm run build

# Run database migrations
echo "🗄️ Running database migrations..."
pnpm run db:migrate

# Restart PM2 process
echo "🔄 Restarting application..."
pm2 restart ai-chatbot

# Check if restart was successful
if pm2 list | grep -q "ai-chatbot.*online"; then
    echo "✅ Deployment completed successfully!"
    echo "📊 Application status:"
    pm2 list
else
    echo "❌ Deployment failed! Check PM2 logs:"
    pm2 logs ai-chatbot --lines 20
    exit 1
fi
