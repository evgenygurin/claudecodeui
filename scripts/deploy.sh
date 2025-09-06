#!/bin/bash

# Deploy script for Vercel production
echo "🚀 Starting Vercel production deployment..."

# Check if VERCEL_TOKEN is set
if [ -z "$VERCEL_TOKEN" ]; then
    echo "❌ VERCEL_TOKEN environment variable is not set"
    echo "Please set VERCEL_TOKEN or run 'vercel login' first"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the project
echo "🔨 Building project..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel production..."
vercel --prod --yes --token=$VERCEL_TOKEN

echo "✅ Deployment completed!"
