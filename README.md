# 🎮 BulletBuzz - Auto-Battler Game

A browser-based auto-battler game with sophisticated AI, featuring auto-pathing, combat mechanics, and headless simulation capabilities for balance testing.

## 🚀 Play Now

**[Play BulletBuzz on GitHub Pages](https://tjsingleton.github.io/bulletbuzz/)**

## 🎯 Game Features

### 🧠 Advanced AI
- **Auto-Pathing**: Intelligent movement with wall avoidance
- **Combat AI**: Smart targeting and attack patterns
- **Flee Mechanics**: Enemies retreat when low on health
- **Robot Vacuum Mode**: Efficient pickup collection

### ⚔️ Gameplay Mechanics
- **Auto-Battler**: Watch your character fight automatically
- **XP System**: Level up to unlock new abilities
- **Pickup System**: Collect hearts and XP drops
- **Shop System**: Choose upgrades between levels
- **Difficulty Scaling**: Progressive challenge increase

### 🛠️ Development Features
- **Headless Simulation**: Automated balance testing
- **Real-time Debugging**: Browser console tools
- **Parameter Adjustment**: Live game balance controls
- **Performance Monitoring**: Memory and performance tracking

## 🏗️ Architecture

### 📁 Project Structure
```
bulletbuzz/
├── src/
│   ├── BulletBuzzGame.ts    # Core game logic
│   └── types.ts             # TypeScript interfaces
├── dist/                    # Compiled JavaScript
├── index.html              # Game interface
├── test-runner.js          # Headless simulation
└── package.json            # Dependencies & scripts
```

### 🔧 Technology Stack
- **TypeScript**: Type-safe game development
- **HTML5 Canvas**: Game rendering
- **ES Modules**: Modern JavaScript modules
- **Node.js**: Headless testing environment

## 🚀 Quick Start

### Local Development
```bash
# Clone the repository
git clone https://github.com/tjsingleton/bulletbuzz.git
cd bulletbuzz

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Testing
```bash
# Run headless simulation
node test-runner.js

# Test different configurations
node test-runner.js --test-configs

# Browser console debugging
# Open browser console and use: debugGame.logState()
```

## 🎮 Controls

### Game Controls
- **WASD/Arrow Keys**: Manual movement (optional)
- **P**: Pause/Unpause
- **1-9**: Shop selection (when shop is open)

### Debug Commands (Browser Console)
```javascript
debugGame.logState()        // Log current game state
debugGame.getMemory()       // Check memory usage
debugGame.logPerformance()  // Performance metrics
debugGame.reset()          // Reset game
debugGame.pause()          // Toggle pause
debugGame.spawnEnemy()     // Force spawn enemy
```

## 🧪 Testing & Balance

### Automated Testing
- **Headless Simulation**: Run thousands of games automatically
- **Balance Testing**: Test different parameter configurations
- **Performance Monitoring**: Track memory usage and performance
- **Regression Testing**: Ensure changes don't break existing functionality

### Parameter Adjustment
Real-time adjustment of game balance via browser sliders:
- Player stats (HP, speed, pickup range)
- Enemy behavior (speed, spawn rate)
- Auto-pathing settings (avoidance, flee mechanics)
- Difficulty scaling (level progression)

## 📊 Game Balance

### Current Settings
- **Player**: 12 HP, 0.85 speed, 25 pickup range
- **Enemies**: 0.15 speed, 8s spawn interval
- **Auto-Pathing**: 120 avoidance distance, 2.0 strength
- **Difficulty**: Single enemy until level 6, 15% scaling

### Balance Metrics
- **Success Rate**: % of runs reaching target level
- **Average Time**: Time to reach target level
- **Survival Rate**: % of runs where player survives
- **Performance**: Memory usage and frame rates

## 🔧 Development

### Building
```bash
# TypeScript compilation
npm run build

# Watch mode for development
npm run build:watch

# Type checking only
npm run type-check
```

### Testing
```bash
# Quick balance test
node test-runner.js --quick

# Configuration testing
node test-runner.js --test-configs

# Custom simulation
node test-runner.js --runs 10 --target 5 --time 300
```

## 📈 Performance

### Optimizations
- **Fixed Timestep**: Consistent game updates regardless of frame rate
- **Object Pooling**: Efficient memory management
- **Lifetime Tracking**: Automatic cleanup of temporary objects
- **Array Limits**: Prevent unbounded growth

### Monitoring
- **Memory Usage**: Automatic warnings at 90% capacity
- **Performance Metrics**: Frame rate and update timing
- **Debug Tools**: Real-time state inspection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

- [ ] **Multiplayer Support**: Real-time multiplayer battles
- [ ] **More Enemy Types**: Different enemy behaviors and abilities
- [ ] **Power-ups**: Temporary buffs and special abilities
- [ ] **Achievements**: Unlockable achievements and stats
- [ ] **Mobile Support**: Touch controls and mobile optimization
- [ ] **Sound Effects**: Audio feedback and music
- [ ] **Particle Effects**: Visual enhancements and feedback

## 🐛 Known Issues

- **Performance**: High enemy counts may impact frame rate
- **Balance**: Early game may be too easy for experienced players
- **Mobile**: Touch controls not yet implemented

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/tjsingleton/bulletbuzz/issues)
- **Discussions**: [GitHub Discussions](https://github.com/tjsingleton/bulletbuzz/discussions)
- **Wiki**: [Game Balance Wiki](https://github.com/tjsingleton/bulletbuzz/wiki)

---

**Made with ❤️ by [@tjsingleton](https://github.com/tjsingleton)**
