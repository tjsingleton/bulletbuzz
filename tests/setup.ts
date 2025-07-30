// Jest setup file for BulletBuzz tests
import { BulletBuzzGame } from '../src/BulletBuzzGame';

// Global test utilities
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidGameState(): R;
      toHaveValidPlayer(): R;
    }
  }
}

// Custom matchers for game state validation
expect.extend({
  toBeValidGameState(received: any) {
    const pass = received && 
                 typeof received === 'object' &&
                 typeof received.gameTime === 'number' &&
                 typeof received.level === 'number' &&
                 typeof received.score === 'number' &&
                 received.player &&
                 typeof received.enemiesKilled === 'number' &&
                 typeof received.xpCollected === 'number' &&
                 typeof received.heartsCollected === 'number' &&
                 typeof received.axesThrown === 'number' &&
                 typeof received.enemiesSpawned === 'number';
    
    return {
      pass,
      message: () => `expected ${received} to be a valid game state`,
    };
  },

  toHaveValidPlayer(received: any) {
    const pass = received && 
                 typeof received.hp === 'number' &&
                 typeof received.maxHp === 'number' &&
                 typeof received.x === 'number' &&
                 typeof received.y === 'number' &&
                 typeof received.radius === 'number' &&
                 typeof received.speed === 'number' &&
                 typeof received.pickupRange === 'number' &&
                 typeof received.attackRange === 'number' &&
                 typeof received.hitTimer === 'number';
    
    return {
      pass,
      message: () => `expected ${received} to be a valid player object`,
    };
  },
});

// Test utilities
export const createTestGame = (config?: any) => {
  return new BulletBuzzGame(config || {
    startHp: 10,
    pickupRange: 25,
    playerSpeed: 0.85,
    enemySpeed: 0.15,
    spawnInterval: 8000,
    heartDropRate: 0.20,
    avoidDistance: 120,
    avoidStrength: 2.0,
    singleEnemyLevel: 6,
    minSpawnInterval: 4500
  });
};

export const runGameForSteps = (game: BulletBuzzGame, steps: number) => {
  for (let i = 0; i < steps; i++) {
    game.step(1/60); // 60 FPS
  }
  return game;
}; 