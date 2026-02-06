#!/bin/bash

# Portfolio Deployment Script

echo "Starting deployment process..."

# Check if .env.prod exists
if [ ! -f .env.prod ]; then
    echo "Error: .env.prod not found!"
    echo "Please create .env.prod from .env.prod.example"
    exit 1
fi

# Pull latest changes (optional, if running on VPS)
# git pull origin main

# Build and start containers
echo "Building and starting containers..."
docker-compose -f docker-compose.prod.yml up -d --build

# Clean up unused images
echo "Cleaning up old images..."
docker image prune -f

echo "Deployment completed successfully!"
echo "App is running on port 80"
