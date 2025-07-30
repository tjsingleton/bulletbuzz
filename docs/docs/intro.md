---
sidebar_position: 1
---

# 🎮 BulletBuzz - Auto-Battler Game

A browser-based auto-battler game with sophisticated AI, featuring auto-pathing, combat mechanics, and headless simulation capabilities for balance testing.

![BulletBuzz Game Screenshot](../../game-screenshot.png)

## 🚀 Quick Start

**[Play BulletBuzz on GitHub Pages](https://tjsingleton.github.io/bulletbuzz/)**

**🎮 Development Mode**: Add `?speed=10` to the URL for 10x game speed for faster testing!

## 🎯 What is BulletBuzz?

BulletBuzz is an auto-battler game where you watch your character fight automatically using sophisticated AI. The game features:

- **🧠 Advanced AI**: Intelligent auto-pathing with wall avoidance and smart targeting
- **⚔️ Auto-Battler**: Watch your character fight automatically with sophisticated combat mechanics
- **🎨 Modern UI**: Professional shop modals and detailed game over screens
- **🧪 Testing**: Comprehensive unit tests and automated screenshot testing

## 🏗️ Architecture

### Technology Stack
- **TypeScript**: Type-safe game development
- **HTML5 Canvas**: Game rendering
- **ES Modules**: Modern JavaScript modules
- **Node.js**: Headless testing environment
- **Jest**: Unit testing framework
- **Playwright**: Automated browser testing and screenshots

### Core Systems
- **Game Loop**: Fixed timestep implementation for consistent updates
- **AI System**: Auto-pathing with wall avoidance and target tracking
- **Combat System**: Automatic axe throwing and collision detection
- **Pickup System**: XP and heart collection with attraction mechanics
- **Level System**: XP progression and shop management
- **Spawn System**: Dynamic enemy and pickup generation

## 🚀 Getting Started

### Local Development
```bash
# Clone the repository
git clone https://github.com/tjsingleton/bulletbuzz.git
cd bulletbuzz

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:8080
```

### Game Speed Control
- **Development**: `http://localhost:8080/?speed=10` for 10x speed
- **Production**: [https://tjsingleton.github.io/bulletbuzz/](https://tjsingleton.github.io/bulletbuzz/) (1x speed)
- **Custom**: `?speed=X` where X is any positive number

## 🎮 Game Features

### 🧠 Advanced AI
- **Auto-Pathing**: Intelligent movement with wall avoidance and target tracking
- **Combat AI**: Smart targeting within attack range with automatic axe throwing
- **Pickup Attraction**: XP orbs and hearts attract to player within pickup range
- **Robot Vacuum Mode**: Efficient pickup collection with pathfinding to drops

### ⚔️ Gameplay Mechanics
- **Auto-Battler**: Watch your character fight automatically
- **XP System**: Level up to unlock new abilities with accurate progress tracking
- **Pickup System**: Collect hearts and XP drops with attraction mechanics
- **Shop System**: Choose upgrades between levels with auto-shop option
- **Difficulty Scaling**: Progressive challenge increase with dynamic spawn rates

### 🎨 Enhanced UI
- **Professional Shop Modal**: Button-like options with sequential numbering
- **Detailed Game Over Screen**: Comprehensive statistics with skull emoji
- **Real-time Stats**: Live player and enemy statistics
- **Range Visualization**: Attack and pickup range circles
- **XP Progress Bar**: Visual progress tracking

## 🧪 Testing & Development

### Available Scripts
```bash
# Development
npm run dev              # Start development server
npm run dev:watch        # Watch mode for TypeScript
npm run build            # Build for production
npm run type-check       # Type checking only

# Testing
npm test                 # Run all tests
npm run test:watch       # Watch mode for tests
npm run test:coverage    # Coverage report

# Screenshots
npm run screenshots      # Basic screenshot test
npm run screenshots:ui   # UI element screenshots
npm run screenshots:all  # All screenshot tests
```

### Testing Features
- **Unit Tests**: 28 comprehensive tests covering all systems
- **Headless Simulation**: Run thousands of games automatically
- **Balance Testing**: Test different parameter configurations
- **Performance Monitoring**: Track memory usage and performance
- **Screenshot Testing**: Automated visual testing with Playwright

## 📊 Game Balance

### Current Settings
- **Player**: 10 HP, 0.85 speed, 25 pickup range, 150 attack range
- **Enemies**: 0.15 speed, 8s spawn interval
- **Auto-Pathing**: 120 avoidance distance, 2.0 strength
- **Difficulty**: Single enemy until level 6, 15% scaling
- **Shop**: Appears after every level with 3 random options

## 🤝 Contributing

We welcome contributions! Please see our [GitHub repository](https://github.com/tjsingleton/bulletbuzz) for details on how to:

1. Set up your development environment
2. Run tests and take screenshots
3. Submit pull requests
4. Follow our coding standards

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/tjsingleton/bulletbuzz/issues)
- **Discussions**: [GitHub Discussions](https://github.com/tjsingleton/bulletbuzz/discussions)
- **Wiki**: [Game Balance Wiki](https://github.com/tjsingleton/bulletbuzz/wiki)

---

**Made with ❤️ by [@tjsingleton](https://github.com/tjsingleton)**
