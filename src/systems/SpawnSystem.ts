import { Game } from '../core/Game.js';
import { Enemy } from '../core/Enemy.js';
import { XpDrop } from '../core/XpDrop.js';
import { HeartDrop } from '../core/HeartDrop.js';

/**
 * Spawn System
 * Handles enemy spawning and pickup generation
 */
export class SpawnSystem {
  private game: Game;
  private spawnTimer: number = 0;
  private canvasWidth: number = 800;
  private canvasHeight: number = 600;
  
  public setCanvasDimensions(width: number, height: number): void {
    this.canvasWidth = width;
    this.canvasHeight = height;
  }

  constructor(game: Game) {
    this.game = game;
  }

  /**
   * Update spawn system for one timestep
   */
  public update(): void {
    this.spawnTimer += this.game.timestep;
    
    // Calculate spawn interval based on level (in seconds)
    const spawnInterval = Math.max(
      this.game.minSpawnInterval / 1000, // Convert to seconds
      (this.game.baseSpawnInterval - (this.game.level - 1) * 100) / 1000
    );
    
    // For testing, use a shorter interval
    const testInterval = Math.min(spawnInterval, 0.5); // Max 0.5 seconds for testing
    
    if (this.spawnTimer >= testInterval) {
      this.spawnEnemy();
      this.spawnTimer = 0;
    }
  }

  /**
   * Spawn a new enemy
   */
  private spawnEnemy(): void {
    // Spawn from edges
    let x: number, y: number;
    const side = Math.floor(Math.random() * 4);
    
    switch (side) {
      case 0: // Top
        x = Math.random() * this.canvasWidth;
        y = -20;
        break;
      case 1: // Right
        x = this.canvasWidth + 20;
        y = Math.random() * this.canvasHeight;
        break;
      case 2: // Bottom
        x = Math.random() * this.canvasWidth;
        y = this.canvasHeight + 20;
        break;
      default: // Left
        x = -20;
        y = Math.random() * this.canvasHeight;
        break;
    }
    
    const enemy = new Enemy(x, y, this.game.level, this.game.enemySpeed);
    this.game.enemies.push(enemy);
    this.game.enemiesSpawned++;
  }

  /**
   * Spawn XP drop at enemy death location
   */
  public spawnXpDrop(x: number, y: number, value: number = 1): void {
    const xpDrop = new XpDrop(x, y, value);
    this.game.xpDrops.push(xpDrop);
  }

  /**
   * Spawn heart drop at enemy death location (random chance)
   */
  public spawnHeartDrop(x: number, y: number): void {
    if (Math.random() < this.game.heartDropRate) {
      const heartDrop = new HeartDrop(x, y);
      this.game.heartDrops.push(heartDrop);
    }
  }

  /**
   * Reset spawn system
   */
  public reset(): void {
    this.spawnTimer = 0;
  }
} 