#!/bin/bash

echo "🔧 Fixing Netlify deployment issues..."

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

# Check if netlify.toml exists
if [ ! -f "netlify.toml" ]; then
    echo "❌ netlify.toml not found. Creating basic configuration..."
    cat > netlify.toml << EOF
[build]
  publish = "."
  command = "echo 'Static site deployment'"
EOF
fi

echo "📦 Deploying to Netlify with fixed configuration..."

# Deploy to Netlify
netlify deploy --prod --dir .

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your site should now be working at: https://wardenofsystems.netlify.app/"
    echo ""
    echo "🔍 If you still see issues:"
    echo "1. Wait 2-3 minutes for CDN propagation"
    echo "2. Clear your browser cache (Ctrl+F5 or Cmd+Shift+R)"
    echo "3. Try opening in an incognito/private window"
else
    echo "❌ Deployment failed. Check the error messages above."
    exit 1
fi
