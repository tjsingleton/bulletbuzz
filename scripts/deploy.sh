#!/bin/bash

# Comprehensive deployment script
set -e

echo "🚀 Starting comprehensive deployment..."

# Get current commit
CURRENT_COMMIT=$(git rev-parse --short HEAD)
echo "📋 Current commit: $CURRENT_COMMIT"

# Build with version
echo "🔧 Building with version..."
npm run build:version

# Check if there are changes
if git diff --quiet; then
    echo "ℹ️ No changes to commit"
else
    echo "📝 Committing changes..."
    git add .
    git commit -m "Deploy version $CURRENT_COMMIT"
fi

# Push to remote
echo "📤 Pushing to remote..."
git push

echo ""
echo "⏳ Starting deployment monitoring..."
echo "📊 This will monitor for 5 minutes to ensure deployment completes"
echo ""

# Monitor deployment
npm run deploy:monitor

echo ""
echo "✅ Deployment process complete!"
echo "🎮 Game: https://tjsingleton.github.io/bulletbuzz/game/"
echo "📚 Docs: https://tjsingleton.github.io/bulletbuzz/" 