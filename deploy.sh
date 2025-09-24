#!/bin/bash

echo "🚀 Deploying Warden of Systems to Netlify..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found. Installing..."
    npm install -g netlify-cli
fi

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ index.html not found. Are you in the right directory?"
    exit 1
fi

# Deploy to Netlify
echo "📦 Deploying static site..."
netlify deploy --prod --dir .

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your site is now live on Netlify!"
    echo "📱 The MCP server remains local for AI development"
else
    echo "❌ Deployment failed. Check the error messages above."
    exit 1
fi
