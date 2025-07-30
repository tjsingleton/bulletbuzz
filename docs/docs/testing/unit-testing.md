---
sidebar_position: 1
---

# Unit Testing

Comprehensive unit testing documentation for BulletBuzz using Jest.

## Overview

BulletBuzz includes 28 comprehensive unit tests covering all game systems using the Jest testing framework.

## Test Structure

### Test Categories

- **Initialization**: Game creation and configuration
- **Game State Management**: State tracking and updates
- **Game Loop**: Time stepping and updates
- **AI and Auto-Pathing**: AI behavior testing
- **Enemy Spawning**: Enemy generation and management
- **Combat System**: Fighting and damage mechanics
- **Pickup System**: XP and heart collection
- **Level Progression**: XP and leveling system
- **Game Over Conditions**: End game scenarios
- **Shop System**: Upgrade selection and management
- **Performance and Memory**: Memory usage and performance
- **Configuration Validation**: Parameter validation
- **Game Reset**: State reset functionality

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

### Test Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts']
};
```

## Test Examples

### Game Initialization

```typescript
describe('BulletBuzzGame', () => {
  describe('Initialization', () => {
    test('should create game with default configuration', () => {
      const game = new BulletBuzzGame();
      const state = game.getGameState();
      
      expect(state.playerHp).toBe(10);
      expect(state.level).toBe(1);
      expect(state.gameOver).toBe(false);
    });

    test('should create game with custom configuration', () => {
      const game = new BulletBuzzGame({
        playerHp: 15,
        playerSpeed: 1.0
      });
      
      const state = game.getGameState();
      expect(state.playerHp).toBe(15);
    });
  });
});
```

### Game State Management

```typescript
describe('Game State Management', () => {
  test('should return valid game state', () => {
    const game = new BulletBuzzGame();
    const state = game.getGameState();
    
    expect(state).toBeValidGameState();
  });

  test('should track memory usage', () => {
    const game = new BulletBuzzGame();
    const memory = game.getMemory();
    
    expect(memory.usage).toBeGreaterThan(0);
    expect(memory.usage).toBeLessThanOrEqual(100);
  });
});
```

### Game Loop Testing

```typescript
describe('Game Loop', () => {
  test('should step game forward in time', () => {
    const game = new BulletBuzzGame();
    const initialState = game.getGameState();
    
    game.step(1/60);
    const newState = game.getGameState();
    
    expect(newState.gameTime).toBeGreaterThan(initialState.gameTime);
  });
});
```

## Custom Matchers

### Game State Matcher

```typescript
expect.extend({
  toBeValidGameState(received) {
    const pass = received &&
      typeof received.playerHp === 'number' &&
      typeof received.level === 'number' &&
      typeof received.gameOver === 'boolean';
    
    return {
      pass,
      message: () => `Expected valid game state, got ${JSON.stringify(received)}`
    };
  }
});
```

### Player Matcher

```typescript
expect.extend({
  toHaveValidPlayer(received) {
    const pass = received &&
      typeof received.playerHp === 'number' &&
      typeof received.playerX === 'number' &&
      typeof received.playerY === 'number';
    
    return {
      pass,
      message: () => `Expected valid player, got ${JSON.stringify(received)}`
    };
  }
});
```

## Test Utilities

### Test Game Creation

```typescript
export function createTestGame(config?: GameConfig): BulletBuzzGame {
  return new BulletBuzzGame({
    spawnInterval: 1.0,
    minSpawnInterval: 0.5,
    enemySpeed: 0.1,
    ...config
  });
}
```

### Game Step Helper

```typescript
export function runGameForSteps(game: BulletBuzzGame, steps: number): void {
  for (let i = 0; i < steps; i++) {
    game.step(1/60);
  }
}
```

## Best Practices

### Test Organization

- **Descriptive Names**: Use clear, descriptive test names
- **Grouped Tests**: Group related tests in describe blocks
- **Isolated Tests**: Each test should be independent
- **Clean Setup**: Set up test data consistently

### Test Data

- **Consistent Data**: Use consistent test data across tests
- **Edge Cases**: Test boundary conditions and edge cases
- **Error Conditions**: Test error handling and invalid inputs
- **Performance**: Test performance-critical code paths

### Test Maintenance

- **Keep Updated**: Update tests when code changes
- **Refactor Tests**: Improve test code as the codebase evolves
- **Monitor Coverage**: Track and improve test coverage
- **Review Failures**: Act quickly on test failures

## Coverage Goals

### Line Coverage

- **Target**: >90% line coverage
- **Critical Paths**: 100% coverage for critical game logic
- **Error Handling**: 100% coverage for error paths
- **Public API**: 100% coverage for public methods

### Test Categories

- **Unit Tests**: Test individual components in isolation
- **Integration Tests**: Test component interactions
- **Performance Tests**: Test performance characteristics
- **Memory Tests**: Test memory usage patterns

## Debugging Tests

### Common Issues

- **Async Tests**: Use async/await for asynchronous tests
- **Timing Issues**: Use appropriate timeouts for timing-dependent tests
- **State Pollution**: Reset state between tests
- **Mock Dependencies**: Mock external dependencies appropriately

### Debug Commands

```bash
# Run specific test file
npm test -- tests/BulletBuzzGame.test.ts

# Run specific test
npm test -- --testNamePattern="should create game"

# Debug mode
npm test -- --verbose --detectOpenHandles
``` 