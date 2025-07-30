#!/bin/bash

# BulletBuzz Logo Update Script
# This script helps update logo display settings consistently

set -e  # Exit on any error

echo "🎨 BulletBuzz Logo Update Script"

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

# Function to update logo size in docs
update_docs_logo() {
    local size=$1
    print_status "Updating logo size in docs/index.md to ${size}px..."
    
    if [ "$size" = "natural" ]; then
        # Remove width constraint
        sed -i '' 's/![BulletBuzz Logo](logo.png){ width="[^"]*" }/![BulletBuzz Logo](logo.png)/g' docs/index.md
        print_success "Logo set to natural size in documentation"
    else
        # Set specific width
        sed -i '' 's/![BulletBuzz Logo](logo.png){ width="[^"]*" }/![BulletBuzz Logo](logo.png){ width="'"$size"'" }/g' docs/index.md
        sed -i '' 's/![BulletBuzz Logo](logo.png)$/![BulletBuzz Logo](logo.png){ width="'"$size"'" }/g' docs/index.md
        print_success "Logo size set to ${size}px in documentation"
    fi
}

# Function to update logo size in game
update_game_logo() {
    local size=$1
    print_status "Updating logo size in game to ${size}px..."
    
    sed -i '' 's/max-width: [0-9]*px/max-width: '"$size"'px/g' index.html
    print_success "Logo size set to ${size}px in game"
}

# Function to toggle game title
toggle_game_title() {
    local show=$1
    if [ "$show" = "true" ]; then
        print_status "Adding title to game page..."
        # Add title after logo
        sed -i '' '/<img src="..\/logo.png"/a\
            <h1 style="margin-top: 20px; color: #FFD700; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">🎮 BulletBuzz 🎮</h1>' index.html
        print_success "Title added to game page"
    else
        print_status "Removing title from game page..."
        # Remove title line
        sed -i '' '/🎮 BulletBuzz 🎮/d' index.html
        print_success "Title removed from game page"
    fi
}

# Main menu
echo ""
echo "What would you like to update?"
echo "1. Update logo size in documentation"
echo "2. Update logo size in game"
echo "3. Toggle game title (show/hide)"
echo "4. Set logo to natural size everywhere"
echo "5. Set logo to 150px everywhere"
echo "6. Exit"
echo ""

read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        read -p "Enter logo size in pixels (or 'natural' for no constraint): " size
        update_docs_logo "$size"
        ;;
    2)
        read -p "Enter logo size in pixels: " size
        update_game_logo "$size"
        ;;
    3)
        read -p "Show title? (true/false): " show
        toggle_game_title "$show"
        ;;
    4)
        update_docs_logo "natural"
        update_game_logo "300"
        print_success "Logo set to natural size everywhere"
        ;;
    5)
        update_docs_logo "150"
        update_game_logo "150"
        print_success "Logo set to 150px everywhere"
        ;;
    6)
        print_status "Exiting..."
        exit 0
        ;;
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

print_status "Don't forget to run ./scripts/deploy.sh to deploy your changes!" 