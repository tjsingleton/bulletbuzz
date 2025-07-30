import { Game } from '../core/Game.js';
import { Axe } from '../core/Axe.js';

/**
 * Level System
 * Handles level progression, XP management, and automatic attacks
 */
export class LevelSystem {
  private game: Game;
  private attackTimer: number = 0;
  private xpToNextLevel: number = 10;
  private currentXp: number = 0;

  constructor(game: Game) {
    this.game = game;
  }

  /**
   * Update level system for one timestep
   */
  public update(): void {
    this.handleLevelProgression();
    this.handleAutomaticAttacks();
  }

  /**
   * Handle XP collection and level progression
   */
  private handleLevelProgression(): void {
    // Check if we have enough XP to level up
    if (this.currentXp >= this.xpToNextLevel) {
      this.levelUp();
    }
  }

  /**
   * Level up the player
   */
  private levelUp(): void {
    this.game.level++;
    this.currentXp -= this.xpToNextLevel;
    
    // Calculate XP needed for next level
    this.xpToNextLevel = Math.floor(10 * Math.pow(1.2, this.game.level - 1));
    
    // Record level time
    const minutes = Math.floor(this.game.gameTime / 60);
    const seconds = Math.floor(this.game.gameTime % 60);
    this.game.levelTimes[this.game.level] = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Show shop after every level and pause the game
    this.game.showShop = true;
    this.game.paused = true;
  }

  /**
   * Handle automatic axe throwing
   */
  private handleAutomaticAttacks(): void {
    this.attackTimer += this.game.timestep;
    
    const attackInterval = 1.0 / this.game.attackSpeed;
    
    if (this.attackTimer >= attackInterval) {
      this.throwAxes();
      this.attackTimer = 0;
    }
  }

  /**
   * Throw axes at nearby enemies
   */
  private throwAxes(): void {
    const player = this.game.player;
    
    // Find closest enemy within attack range
    let closestEnemy = null;
    let closestDistance = Infinity;
    
    for (const enemy of this.game.enemies) {
      const distance = Math.sqrt((player.x - enemy.x) ** 2 + (player.y - enemy.y) ** 2);
      if (distance < this.game.attackRange && distance < closestDistance) {
        closestDistance = distance;
        closestEnemy = enemy;
      }
    }
    
    if (closestEnemy) {
      // Throw multiple axes based on projectile count
      for (let i = 0; i < this.game.projectileCount; i++) {
        const axe = new Axe(
          player.x,
          player.y,
          closestEnemy.x,
          closestEnemy.y,
          this.game.projectileSpeed,
          1
        );
        this.game.axes.push(axe);
        this.game.axesThrown++;
      }
    } else {
      // Throw random axes for visual feedback when no enemies are in range
      for (let i = 0; i < this.game.projectileCount; i++) {
        const randomAngle = Math.random() * Math.PI * 2;
        const randomDistance = 50 + Math.random() * 100;
        const targetX = player.x + Math.cos(randomAngle) * randomDistance;
        const targetY = player.y + Math.sin(randomAngle) * randomDistance;
        
        const axe = new Axe(
          player.x,
          player.y,
          targetX,
          targetY,
          this.game.projectileSpeed,
          1
        );
        this.game.axes.push(axe);
        this.game.axesThrown++;
      }
    }
  }

  /**
   * Add XP to the player
   */
  public addXp(amount: number): void {
    this.currentXp += amount;
  }

  /**
   * Get current XP progress
   */
  public getXpProgress(): { current: number; required: number; level: number } {
    return {
      current: this.currentXp,
      required: this.xpToNextLevel,
      level: this.game.level
    };
  }

  /**
   * Check if target level has been reached
   */
  public hasReachedLevel(targetLevel: number): boolean {
    return this.game.level >= targetLevel;
  }

  /**
   * Reset level system
   */
  public reset(): void {
    this.attackTimer = 0;
    this.xpToNextLevel = 10;
    this.currentXp = 0;
  }
} 