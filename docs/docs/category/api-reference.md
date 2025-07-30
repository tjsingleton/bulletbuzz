---
sidebar_position: 1
---

# API Reference

The BulletBuzz API provides a comprehensive interface for game development, testing, and integration.

## API Overview

The BulletBuzz API is built around the `BulletBuzzGame` class, which serves as the main facade for all game functionality. The API is designed to be:

- **Type-safe**: Full TypeScript support with comprehensive type definitions
- **Modular**: Clean separation between game systems
- **Testable**: Easy to unit test and mock
- **Extensible**: Designed for easy extension and customization

## Architecture

The API is organized into several key areas:

- **Game API**: Core game functionality and state management
- **AI API**: Auto-pathing and AI behavior controls
- **Testing API**: Headless testing and simulation
- **Screenshot API**: Automated visual testing
- **Configuration API**: Game balance and settings

## Quick Start

```typescript
import { BulletBuzzGame } from './src/BulletBuzzGame';

// Create a new game instance
const game = new BulletBuzzGame({
  playerHp: 10,
  playerSpeed: 0.85,
  enemySpeed: 0.15,
  spawnInterval: 8.0
});

// Step the game forward
game.step(1/60);

// Get current game state
const state = game.getGameState();
console.log(`Level: ${state.level}, Enemies Killed: ${state.enemiesKilled}`);
```

## API Categories

### Game API
Core game functionality including state management, game loop, and basic controls.

### AI API
Auto-pathing controls, AI behavior configuration, and movement systems.

### Testing API
Headless simulation, unit testing utilities, and performance monitoring.

### Screenshot API
Automated visual testing with Playwright integration.

### Configuration API
Game balance settings, difficulty scaling, and parameter adjustment.

## Development

The API is built with TypeScript and follows modern JavaScript patterns:

- **ES Modules**: All imports/exports use ES module syntax
- **Type Safety**: Comprehensive TypeScript definitions
- **Documentation**: JSDoc comments for all public methods
- **Testing**: Full unit test coverage for all API methods

## Next Steps

Explore the API documentation by category:

1. **Game API** - Start here for basic game functionality
2. **AI API** - Learn about auto-pathing and AI controls
3. **Testing API** - Understand testing and simulation
4. **Screenshot API** - Automated visual testing
5. **Configuration API** - Game balance and settings 