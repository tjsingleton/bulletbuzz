import { GameConfig, GameState, MemoryUsage } from '../types.js';
import { Player } from './Player.js';
import { Enemy } from './Enemy.js';
import { XpDrop } from './XpDrop.js';
import { HeartDrop } from './HeartDrop.js';
import { Axe } from './Axe.js';
import { SpawnSystem } from '../systems/SpawnSystem.js';
import { CollisionSystem } from '../systems/CollisionSystem.js';
import { LevelSystem } from '../systems/LevelSystem.js';

/**
 * Core Game Class
 * Handles the main game loop, state management, and coordination between systems
 */
export class Game {
  // Game state
  public gameTime: number = 0;
  public level: number = 1;
  public score: number = 0;
  public enemiesKilled: number = 0;
  public xpCollected: number = 0;
  public heartsCollected: number = 0;
  public axesThrown: number = 0;
  public enemiesSpawned: number = 0;
  public levelTimes: Record<number, string> = {};
  
  // Fixed timestep variables
  private accumulator: number = 0;
  
  // Memory management - maximum array sizes
  private readonly maxEnemies: number = 100;
  private readonly maxXpDrops: number = 200;
  private readonly maxHeartDrops: number = 50;
  private readonly maxAxes: number = 50;
  
  // Game objects
  public player: Player;
  public enemies: Enemy[] = [];
  public xpDrops: XpDrop[] = [];
  public heartDrops: HeartDrop[] = [];
  public axes: Axe[] = [];
  
  // Game parameters
  public baseSpawnInterval: number;
  public enemySpeed: number;
  public heartDropRate: number;
  public avoidDistance: number;
  public avoidStrength: number;
  public fleeRange: number;
  public fleeStrength: number;
  public singleEnemyLevel: number;
  public minSpawnInterval: number;
  public levelScaling: number;
  public earlyLevelScaling: number;
  
  // Combat parameters
  public attackRange: number;
  public projectileCount: number;
  public projectileSpeed: number;
  public attackSpeed: number;
  
  // Timestep for systems
  public get timestep(): number {
    return this._timestep;
  }
  
  private readonly _timestep: number = 1/60; // 60 FPS fixed timestep
  
  // Game mechanics
  public paused: boolean = false;
  public showShop: boolean = false;
  public autoPathing: boolean;
  
  // Systems
  public spawnSystem: SpawnSystem;
  public collisionSystem: CollisionSystem;
  public levelSystem: LevelSystem;
  
  // Canvas dimensions (for bounds checking)
  public canvasWidth: number = 800;
  public canvasHeight: number = 600;

  constructor(config: GameConfig = {}) {
    // Initialize game parameters with defaults
    this.baseSpawnInterval = config.spawnInterval ?? 2000; // 2 seconds instead of 8
    this.enemySpeed = config.enemySpeed ?? 0.5; // Faster enemies for testing
    this.heartDropRate = config.heartDropRate ?? 0.20;
    this.avoidDistance = config.avoidDistance ?? 120;
    this.avoidStrength = config.avoidStrength ?? 2.0;
    this.fleeRange = config.fleeRange ?? 80;
    this.fleeStrength = config.fleeStrength ?? 1.5;
    this.singleEnemyLevel = config.singleEnemyLevel ?? 6;
    this.minSpawnInterval = config.minSpawnInterval ?? 1000; // 1 second instead of 4.5
    this.levelScaling = config.levelScaling ?? 1.2;
    this.earlyLevelScaling = config.earlyLevelScaling ?? 1.1;
    
    this.attackRange = config.attackRange ?? 150;
    this.projectileCount = config.projectileCount ?? 1;
    this.projectileSpeed = config.projectileSpeed ?? 3.0;
    this.attackSpeed = config.attackSpeed ?? 2.0; // 2 attacks per second instead of 1
    
    this.autoPathing = config.autoPathing ?? true;
    
    // Initialize player
    this.player = new Player(config);
    
    // Initialize systems
    this.spawnSystem = new SpawnSystem(this);
    this.collisionSystem = new CollisionSystem(this);
    this.levelSystem = new LevelSystem(this);
  }

  /**
   * Main game step - called with delta time
   */
  public step(deltaTime: number = 1/60): void {
    if (this.paused) return;
    
    // Fixed timestep accumulation
    this.accumulator += deltaTime;
    
    while (this.accumulator >= this.timestep) {
      this.update();
      this.accumulator -= this.timestep;
    }
  }

  /**
   * Update game state for one timestep
   */
  private update(): void {
    this.gameTime += this.timestep;
    
    // Update systems
    this.spawnSystem.update();
    this.collisionSystem.update();
    this.levelSystem.update();
    
    // Update game objects
    this.updatePlayer();
    this.updateEnemies();
    this.updateProjectiles();
    this.updatePickups();
    
    // Cleanup expired objects
    this.cleanup();
  }

  private updatePlayer(): void {
    this.player.update(this.timestep);
    
    // Handle AI movement if auto-pathing is enabled
    if (this.autoPathing) {
      this.player.moveWithAI(this.enemies, this.xpDrops, this.heartDrops);
    }
  }

  private updateEnemies(): void {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.update(this.timestep);
      
      // Remove dead enemies
      if (enemy.hp <= 0) {
        this.enemies.splice(i, 1);
        this.enemiesKilled++;
      }
    }
  }

  private updateProjectiles(): void {
    for (let i = this.axes.length - 1; i >= 0; i--) {
      const axe = this.axes[i];
      axe.update(this.timestep);
      
      // Remove expired axes
      if (axe.isExpired()) {
        this.axes.splice(i, 1);
      }
    }
  }

  private updatePickups(): void {
    // Update XP drops
    for (let i = this.xpDrops.length - 1; i >= 0; i--) {
      const xp = this.xpDrops[i];
      xp.update(this.timestep, this.player.x, this.player.y, this.player.pickupRange);
      
      if (xp.isExpired()) {
        this.xpDrops.splice(i, 1);
      }
    }
    
    // Update heart drops
    for (let i = this.heartDrops.length - 1; i >= 0; i--) {
      const heart = this.heartDrops[i];
      heart.update(this.timestep, this.player.x, this.player.y, this.player.pickupRange);
      
      if (heart.isExpired()) {
        this.heartDrops.splice(i, 1);
      }
    }
  }

  private cleanup(): void {
    // Enforce array size limits
    if (this.enemies.length > this.maxEnemies) {
      this.enemies.splice(0, this.enemies.length - this.maxEnemies);
    }
    if (this.xpDrops.length > this.maxXpDrops) {
      this.xpDrops.splice(0, this.xpDrops.length - this.maxXpDrops);
    }
    if (this.heartDrops.length > this.maxHeartDrops) {
      this.heartDrops.splice(0, this.heartDrops.length - this.maxHeartDrops);
    }
    if (this.axes.length > this.maxAxes) {
      this.axes.splice(0, this.axes.length - this.maxAxes);
    }
  }

  /**
   * Get current game state
   */
  public getGameState(): GameState {
    return {
      gameTime: this.gameTime,
      level: this.level,
      score: this.score,
      player: this.player,
      enemiesKilled: this.enemiesKilled,
      xpCollected: this.xpCollected,
      heartsCollected: this.heartsCollected,
      axesThrown: this.axesThrown,
      enemiesSpawned: this.enemiesSpawned,
      enemiesCount: this.enemies.length,
      xpDropsCount: this.xpDrops.length,
      heartDropsCount: this.heartDrops.length,
      axesCount: this.axes.length,
      levelTimes: this.levelTimes
    };
  }

  /**
   * Get memory usage statistics
   */
  public getMemoryUsage(): MemoryUsage {
    return {
      enemies: this.enemies.length,
      xpDrops: this.xpDrops.length,
      heartDrops: this.heartDrops.length,
      axes: this.axes.length,
      maxEnemies: this.maxEnemies,
      maxXpDrops: this.maxXpDrops,
      maxHeartDrops: this.maxHeartDrops,
      maxAxes: this.maxAxes
    };
  }

  /**
   * Reset game to initial state
   */
  public reset(): void {
    this.gameTime = 0;
    this.level = 1;
    this.score = 0;
    this.enemiesKilled = 0;
    this.xpCollected = 0;
    this.heartsCollected = 0;
    this.axesThrown = 0;
    this.enemiesSpawned = 0;
    this.levelTimes = {};
    this.accumulator = 0;
    this.paused = false;
    this.showShop = false;
    
    // Reset player
    this.player.reset();
    
    // Clear arrays
    this.enemies = [];
    this.xpDrops = [];
    this.heartDrops = [];
    this.axes = [];
    
    // Reset systems
    this.spawnSystem.reset();
    this.collisionSystem.reset();
    this.levelSystem.reset();
  }

  /**
   * Check if game is over
   */
  public isGameOver(): boolean {
    return this.player.hp <= 0;
  }

  /**
   * Set auto-pathing mode
   */
  public setAutoPathing(enabled: boolean): void {
    this.autoPathing = enabled;
  }
} 