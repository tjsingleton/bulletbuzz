---
sidebar_position: 3
---

# Testing API

Documentation for the testing and simulation functionality.

## Overview

The Testing API provides tools for headless testing, simulation, and performance monitoring.

## Headless Testing

### Test Runner

The test runner provides automated balance testing:

```bash
node test-runner.js
```

### Configuration Options

```bash
# Quick test
node test-runner.js --quick

# Custom parameters
node test-runner.js --runs 10 --target 5 --time 300
```

## Performance Monitoring

### Memory Usage

Track memory usage during testing:

```typescript
const memory = game.getMemory();
console.log(`Memory Usage: ${memory.usage}%`);
```

### Performance Metrics

Monitor game performance:

```typescript
const state = game.getGameState();
console.log(`Frame Rate: ${state.frameRate}`);
```

## Debug Commands

### Browser Console

Use these commands in the browser console:

```javascript
debugGame.logState()        // Log current game state
debugGame.getMemory()       // Check memory usage
debugGame.logPerformance()  // Performance metrics
debugGame.reset()          // Reset game
debugGame.pause()          // Toggle pause
debugGame.spawnEnemy()     // Force spawn enemy
```

## Testing Utilities

### Test Helpers

The testing system includes helper functions:

```typescript
// Create test game instance
const testGame = createTestGame();

// Run game for specific steps
runGameForSteps(testGame, 1000);
```

### Custom Matchers

Jest custom matchers for game testing:

```typescript
expect(gameState).toBeValidGameState();
expect(player).toHaveValidPlayer();
```

## Examples

### Basic Testing

```typescript
// Create test game
const game = new BulletBuzzGame();

// Run simulation
for (let i = 0; i < 1000; i++) {
  game.step(1/60);
  
  const state = game.getGameState();
  if (state.gameOver) break;
}

// Check results
console.log(`Level reached: ${game.getLevel()}`);
console.log(`Enemies killed: ${game.getEnemiesKilled()}`);
```

### Performance Testing

```typescript
// Monitor performance
setInterval(() => {
  const memory = game.getMemory();
  const state = game.getGameState();
  
  console.log(`FPS: ${state.frameRate}`);
  console.log(`Memory: ${memory.usage}%`);
}, 1000);
```

## Testing Best Practices

### Test Organization

- **Isolated Tests**: Each test should be independent
- **Clear Names**: Use descriptive test names
- **Proper Setup**: Set up test data consistently
- **Cleanup**: Clean up after tests

### Performance Testing

- **Memory Monitoring**: Track memory usage
- **Frame Rate**: Monitor frame rate consistency
- **Load Testing**: Test with many objects
- **Stress Testing**: Test edge cases

### Balance Testing

- **Success Rate**: Track win/loss ratios
- **Time Analysis**: Measure time to reach goals
- **Difficulty Scaling**: Test progression curves
- **Parameter Tuning**: Optimize game balance 