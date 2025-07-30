#!/bin/bash

# BulletBuzz Deployment Script
# This script handles the complete deployment process

set -e  # Exit on any error

echo "🚀 Starting BulletBuzz deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the bulletbuzz root directory"
    exit 1
fi

print_status "Building documentation..."
mkdocs build

print_status "Recreating site/game directory..."
rm -rf site/game
mkdir -p site/game

print_status "Copying game files..."
cp index.html site/game/
cp -r dist site/game/
cp logo.png favicon.ico logo-192.png logo-512.png site/game/

print_status "Adding files to git..."
git add -f site/game/
git add docs/
git add index.html

# Check if there are changes to commit
if git diff --cached --quiet; then
    print_warning "No changes to commit"
else
    print_status "Committing changes..."
    git commit -m "Deploy BulletBuzz - $(date '+%Y-%m-%d %H:%M:%S')"
    
    print_status "Pushing to GitHub..."
    git push
    
    print_success "Deployment completed! 🎉"
    print_status "Game will be available at: https://tjsingleton.github.io/bulletbuzz/game/"
    print_status "Documentation will be available at: https://tjsingleton.github.io/bulletbuzz/"
fi 