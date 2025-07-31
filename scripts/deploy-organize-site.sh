#!/bin/bash
set -e

echo "🏗️ Organizing site structure..."

echo "Contents of project root after build:"
ls -l
echo "Contents of dist directory:"
ls -l dist/
echo "Contents of assets directory:"
ls -l assets/

# Create game directory
mkdir -p site/game

# Copy game files
cp index.html site/game/
cp -r dist site/game/

# Copy assets with error handling
if [ -f "assets/logo.png" ]; then
  cp assets/logo.png site/game/
else
  echo "⚠️ Warning: logo.png not found in assets/"
fi

if [ -f "assets/favicon.ico" ]; then
  cp assets/favicon.ico site/game/
else
  echo "⚠️ Warning: favicon.ico not found in assets/"
fi

if [ -f "assets/logo-192.png" ]; then
  cp assets/logo-192.png site/game/
else
  echo "⚠️ Warning: logo-192.png not found in assets/"
fi

if [ -f "assets/logo-512.png" ]; then
  cp assets/logo-512.png site/game/
else
  echo "⚠️ Warning: logo-512.png not found in assets/"
fi

if [ -f "assets/game-screenshot.png" ]; then
  cp assets/game-screenshot.png site/
else
  echo "⚠️ Warning: game-screenshot.png not found in assets/"
fi

# Copy documentation files
cp README.md site/
cp LICENSE site/

echo "Contents of site/game after copy:"
ls -la site/game/
echo "Contents of site root after copy:"
ls -la site/

# Verify critical files exist
if [ ! -f "site/game/index.html" ]; then
  echo "❌ Error: index.html not copied to site/game/"
  exit 1
fi

if [ ! -f "site/game/dist/game-ui.js" ]; then
  echo "❌ Error: game-ui.js not copied to site/game/dist/"
  exit 1
fi

echo "✅ All critical files verified" 