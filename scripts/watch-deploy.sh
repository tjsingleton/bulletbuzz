#!/bin/bash

# Watch deployment status
echo "🚀 Starting deployment watch..."
echo "📋 Current commit: $(git rev-parse --short HEAD)"
echo "⏰ Monitoring for 5 minutes..."
echo ""

# Run the deploy monitor
npm run deploy:monitor

echo ""
echo "✅ Deployment monitoring complete!" 