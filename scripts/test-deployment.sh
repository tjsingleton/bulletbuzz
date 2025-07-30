#!/bin/bash

# BulletBuzz Test Deployment Script
# This script runs all tests to verify deployment is working

set -e  # Exit on any error

echo "🧪 Starting BulletBuzz deployment tests..."

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

print_status "Running all tests..."

# Run GitHub Pages test
print_status "Testing GitHub Pages deployment..."
npm run test:github-pages

# Run documentation test
print_status "Testing documentation..."
npm run test:documentation

# Run game content test
print_status "Testing game content..."
npm run test:game-content

# Run README documentation link test
print_status "Testing README documentation link..."
npm run test:readme-docs

print_success "All tests completed! 🎉"
print_status "Check the test results above for any issues." 