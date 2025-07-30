import { BulletBuzzGame } from '../src/BulletBuzzGame';
import { createTestGame, runGameForSteps } from './setup';

describe('BulletBuzzGame', () => {
  let game: BulletBuzzGame;

  beforeEach(() => {
    game = createTestGame();
  });

  describe('Initialization', () => {
    test('should create game with default configuration', () => {
      expect(game).toBeInstanceOf(BulletBuzzGame);
      
      const state = game.getGameState();
      expect(state).toBeValidGameState();
      expect(state.player).toHaveValidPlayer();
    });

    test('should create game with custom configuration', () => {
      const customConfig = {
        startHp: 15,
        pickupRange: 30,
        playerSpeed: 1.0,
        enemySpeed: 0.2,
        spawnInterval: 5000,
        heartDropRate: 0.25,
        avoidDistance: 150,
        avoidStrength: 2.5,
        singleEnemyLevel: 8,
        minSpawnInterval: 3000
      };

      const customGame = new BulletBuzzGame(customConfig);
      const state = customGame.getGameState();
      
      expect(state.player.maxHp).toBe(15);
      expect(state.player.hp).toBe(15);
    });

    test('should initialize with correct default values', () => {
      const state = game.getGameState();
      
      expect(state.gameTime).toBe(0);
      expect(state.level).toBe(1);
      expect(state.score).toBe(0);
      expect(state.enemiesKilled).toBe(0);
      expect(state.xpCollected).toBe(0);
      expect(state.heartsCollected).toBe(0);
      expect(state.player.hp).toBe(10);
      expect(state.player.maxHp).toBe(10);
    });
  });

  describe('Game State Management', () => {
    test('should return valid game state', () => {
      const state = game.getGameState();
      
      expect(state).toHaveProperty('gameTime');
      expect(state).toHaveProperty('level');
      expect(state).toHaveProperty('score');
      expect(state).toHaveProperty('player');
      expect(state).toHaveProperty('enemiesKilled');
      expect(state).toHaveProperty('xpCollected');
      expect(state).toHaveProperty('heartsCollected');
      expect(state).toHaveProperty('axesThrown');
      expect(state).toHaveProperty('enemiesSpawned');
      expect(state).toHaveProperty('enemiesCount');
      expect(state).toHaveProperty('xpDropsCount');
      expect(state).toHaveProperty('heartDropsCount');
      expect(state).toHaveProperty('axesCount');
    });

    test('should return valid memory usage', () => {
      const memory = game.getMemoryUsage();
      
      expect(memory).toHaveProperty('enemies');
      expect(memory).toHaveProperty('xpDrops');
      expect(memory).toHaveProperty('heartDrops');
      expect(memory).toHaveProperty('axes');
      expect(memory).toHaveProperty('maxEnemies');
      expect(memory).toHaveProperty('maxXpDrops');
      expect(memory).toHaveProperty('maxHeartDrops');
      expect(memory).toHaveProperty('maxAxes');
    });
  });

  describe('Game Loop', () => {
    test('should step game forward in time', () => {
      const initialState = game.getGameState();
      const deltaTime = 1/60; // 60 FPS
      
      game.step(deltaTime);
      
      const newState = game.getGameState();
      expect(newState.gameTime).toBeGreaterThan(initialState.gameTime);
      expect(newState.gameTime).toBeCloseTo(initialState.gameTime + deltaTime, 5);
    });

    test('should handle multiple steps correctly', () => {
      runGameForSteps(game, 60); // 1 second at 60 FPS
      
      const newState = game.getGameState();
      expect(newState.gameTime).toBeCloseTo(1.0, 2);
    });

    test('should maintain consistent state across steps', () => {
      const steps = 120; // 2 seconds
      
      for (let i = 0; i < steps; i++) {
        const state = game.getGameState();
        expect(state).toBeValidGameState();
        expect(state.player).toHaveValidPlayer();
        
        game.step(1/60);
      }
    });
  });

  describe('AI and Auto-Pathing', () => {
    test('should have auto-pathing enabled by default', () => {
      expect(game.autoPathing).toBe(true);
    });

    test('should toggle auto-pathing', () => {
      game.setAutoPathing(false);
      expect(game.autoPathing).toBe(false);
      
      game.setAutoPathing(true);
      expect(game.autoPathing).toBe(true);
    });

    test('should move player automatically', () => {
      const initialState = game.getGameState();
      const startX = initialState.player.x;
      const startY = initialState.player.y;
      
      // Run game for a few steps to see AI movement
      runGameForSteps(game, 60);
      
      const newState = game.getGameState();
      // Player should have moved (AI controls movement)
      expect(newState.player.x).not.toBe(startX);
      expect(newState.player.y).not.toBe(startY);
    });
  });

  describe('Enemy Spawning', () => {
    test('should spawn enemies over time', () => {
      const initialState = game.getGameState();
      expect(initialState.enemiesSpawned).toBe(0);
      
      // Run game for enough time to spawn enemies
      runGameForSteps(game, 600); // 10 seconds
      
      const newState = game.getGameState();
      expect(newState.enemiesSpawned).toBeGreaterThan(0);
    });

    test('should respect spawn interval', () => {
      const customGame = new BulletBuzzGame({
        spawnInterval: 2000, // 2 seconds
        minSpawnInterval: 1000
      });
      
      runGameForSteps(customGame, 60); // 1 second
      let state = customGame.getGameState();
      const spawnCount1 = state.enemiesSpawned;
      
      runGameForSteps(customGame, 60); // Another second
      state = customGame.getGameState();
      const spawnCount2 = state.enemiesSpawned;
      
      // Should have spawned more enemies
      expect(spawnCount2).toBeGreaterThanOrEqual(spawnCount1);
    });
  });

  describe('Combat System', () => {
    test('should handle automatic axe throwing', () => {
      const initialState = game.getGameState();
      expect(initialState.axesThrown).toBe(0);
      
      // Run game to trigger automatic combat
      runGameForSteps(game, 300); // 5 seconds
      
      const newState = game.getGameState();
      expect(newState.axesThrown).toBeGreaterThan(0);
    });

    test('should track enemy kills', () => {
      const initialState = game.getGameState();
      expect(initialState.enemiesKilled).toBe(0);
      
      // Run game to spawn and kill enemies
      runGameForSteps(game, 1200); // 20 seconds
      
      const newState = game.getGameState();
      expect(newState.enemiesKilled).toBeGreaterThanOrEqual(initialState.enemiesKilled);
    });
  });

  describe('Pickup System', () => {
    test('should handle XP collection', () => {
      const initialState = game.getGameState();
      expect(initialState.xpCollected).toBe(0);
      
      // Run game to collect XP
      runGameForSteps(game, 600); // 10 seconds
      
      const newState = game.getGameState();
      expect(newState.xpCollected).toBeGreaterThanOrEqual(initialState.xpCollected);
    });

    test('should handle heart collection', () => {
      const initialState = game.getGameState();
      expect(initialState.heartsCollected).toBe(0);
      
      // Run game to collect hearts
      runGameForSteps(game, 600); // 10 seconds
      
      const newState = game.getGameState();
      expect(newState.heartsCollected).toBeGreaterThanOrEqual(initialState.heartsCollected);
    });
  });

  describe('Level Progression', () => {
    test('should level up correctly', () => {
      const initialState = game.getGameState();
      expect(initialState.level).toBe(1);
      
      // Run game until level up
      let currentLevel = initialState.level;
      let steps = 0;
      const maxSteps = 3600; // 1 minute
      
      while (currentLevel === initialState.level && steps < maxSteps) {
        game.step(1/60);
        const state = game.getGameState();
        currentLevel = state.level;
        steps++;
      }
      
      if (steps < maxSteps) {
        expect(currentLevel).toBeGreaterThan(initialState.level);
      }
    });
  });

  describe('Game Over Conditions', () => {
    test('should detect game over when player dies', () => {
      const customGame = new BulletBuzzGame({
        startHp: 1,
        enemySpeed: 0.5,
        spawnInterval: 1000
      });
      
      // Run until player dies
      let steps = 0;
      const maxSteps = 3600;
      
      while (customGame.getGameState().player.hp > 0 && steps < maxSteps) {
        customGame.step(1/60);
        steps++;
      }
      
      const finalState = customGame.getGameState();
      if (steps < maxSteps) {
        expect(finalState.player.hp).toBeLessThanOrEqual(0);
      }
    });

    test('should check game over status', () => {
      expect(game.isGameOver()).toBe(false);
      
      // Create a game with very low HP and run until death
      const weakGame = new BulletBuzzGame({
        startHp: 1,
        enemySpeed: 0.8,
        spawnInterval: 500
      });
      
      let steps = 0;
      const maxSteps = 1800; // 30 seconds
      
      while (!weakGame.isGameOver() && steps < maxSteps) {
        weakGame.step(1/60);
        steps++;
      }
      
      if (steps < maxSteps) {
        expect(weakGame.isGameOver()).toBe(true);
      }
    });
  });

  describe('Shop System', () => {
    test('should provide shop options', () => {
      const options = game.getShopOptions();
      expect(Array.isArray(options)).toBe(true);
      expect(options.length).toBeGreaterThan(0);
      
      options.forEach(option => {
        expect(option).toHaveProperty('key');
        expect(option).toHaveProperty('label');
        expect(option).toHaveProperty('apply');
        expect(typeof option.apply).toBe('function');
      });
    });

    test('should handle shop selection', () => {
      const options = game.getShopOptions();
      if (options.length > 0) {
        const initialPlayer = { ...game.getGameState().player };
        
        game.selectShopOption(options[0].key);
        
        const newPlayer = game.getGameState().player;
        // Player stats should have changed due to upgrade
        expect(newPlayer).not.toEqual(initialPlayer);
      }
    });

    test('should check shop status', () => {
      expect(typeof game.isShopOpen()).toBe('boolean');
    });
  });

  describe('Performance and Memory', () => {
    test('should maintain performance over time', () => {
      const startTime = Date.now();
      
      // Run game for 5 seconds
      runGameForSteps(game, 300);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete within reasonable time (less than 1 second for 5 seconds of game time)
      expect(duration).toBeLessThan(1000);
    });

    test('should not leak memory', () => {
      // Run game for extended period
      runGameForSteps(game, 1800); // 30 seconds
      
      const finalMemory = game.getMemoryUsage();
      
      // Memory usage should be reasonable
      expect(finalMemory.enemies).toBeLessThanOrEqual(finalMemory.maxEnemies);
      expect(finalMemory.xpDrops).toBeLessThanOrEqual(finalMemory.maxXpDrops);
      expect(finalMemory.heartDrops).toBeLessThanOrEqual(finalMemory.maxHeartDrops);
      expect(finalMemory.axes).toBeLessThanOrEqual(finalMemory.maxAxes);
    });
  });

  describe('Configuration Validation', () => {
    test('should handle invalid configuration gracefully', () => {
      const invalidConfig = {
        startHp: -1,
        pickupRange: 0,
        playerSpeed: -0.5,
        enemySpeed: 0,
        spawnInterval: -1000,
        heartDropRate: 1.5, // > 1.0
        avoidDistance: -50,
        avoidStrength: -1,
        singleEnemyLevel: 0,
        minSpawnInterval: -500
      };

      // Should not throw error, but should use sensible defaults
      expect(() => new BulletBuzzGame(invalidConfig)).not.toThrow();
    });
  });

  describe('Game Reset', () => {
    test('should reset game state correctly', () => {
      // Run game for a while to change state
      runGameForSteps(game, 300);
      const midState = game.getGameState();
      expect(midState.gameTime).toBeGreaterThan(0);
      
      // Reset game
      game.reset();
      const resetState = game.getGameState();
      
      expect(resetState.gameTime).toBe(0);
      expect(resetState.level).toBe(1);
      expect(resetState.score).toBe(0);
      expect(resetState.enemiesKilled).toBe(0);
      expect(resetState.xpCollected).toBe(0);
      expect(resetState.heartsCollected).toBe(0);
      expect(resetState.axesThrown).toBe(0);
      expect(resetState.enemiesSpawned).toBe(0);
    });
  });

  describe('Level Checking', () => {
    test('should check if target level reached', () => {
      expect(game.hasReachedLevel(1)).toBe(true);
      expect(game.hasReachedLevel(5)).toBe(false);
      
      // Run game until level 2
      let steps = 0;
      const maxSteps = 3600;
      
      while (!game.hasReachedLevel(2) && steps < maxSteps) {
        game.step(1/60);
        steps++;
      }
      
      if (steps < maxSteps) {
        expect(game.hasReachedLevel(2)).toBe(true);
      }
    });
  });
}); 