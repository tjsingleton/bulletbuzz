import { GameConfig, GameState, MemoryUsage, ShopOption } from './types.js';
import { Game } from './core/Game.js';

/**
 * BulletBuzzGame - Main Game Interface
 * Provides a clean API for the modular game architecture
 */
export class BulletBuzzGame {
  private game: Game;
  
  // Canvas dimensions
  public canvasWidth: number = 800;
  public canvasHeight: number = 600;
  
  // Shop system
  private shopOptions: ShopOption[] = [];

  constructor(config: GameConfig = {}) {
    this.game = new Game(config);
  }

  /**
   * Step the game forward by delta time
   */
  public step(deltaTime: number = 1/60): void {
    this.game.step(deltaTime);
  }

  /**
   * Get current game state
   */
  public getGameState(): GameState {
    return this.game.getGameState();
  }

  /**
   * Get memory usage statistics
   */
  public getMemoryUsage(): MemoryUsage {
    return this.game.getMemoryUsage();
  }

  /**
   * Reset game to initial state
   */
  public reset(): void {
    this.game.reset();
  }

  /**
   * Check if game is over
   */
  public isGameOver(): boolean {
    return this.game.isGameOver();
  }

  /**
   * Set auto-pathing mode
   */
  public setAutoPathing(enabled: boolean): void {
    this.game.setAutoPathing(enabled);
  }
  
  /**
   * Set canvas dimensions
   */
  public setCanvasDimensions(width: number, height: number): void {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.game.canvasWidth = width;
    this.game.canvasHeight = height;
  }

  /**
   * Get auto-pathing status
   */
  public get autoPathing(): boolean {
    return this.game.autoPathing;
  }

  /**
   * Select shop option
   */
  public selectShopOption(key: string): void {
    const option = this.shopOptions.find(opt => opt.key === key);
    if (option) {
      option.apply();
      this.game.showShop = false;
      this.game.paused = false; // Unpause the game
      this.shopOptions = [];
    }
  }

  /**
   * Auto-select shop option
   */
  public autoShop(): void {
    if (this.shopOptions.length > 0) {
      // Simple AI: prioritize speed, then attack range, then projectiles
      const priorities = ['1', '2', '3', '4', '5'];
      for (const priority of priorities) {
        const option = this.shopOptions.find(opt => opt.key === priority);
        if (option) {
          this.selectShopOption(priority);
          break;
        }
      }
    }
  }

  /**
   * Get available shop options
   */
  public getShopOptions(): ShopOption[] {
    // Generate shop options if shop is open and no options exist
    if (this.game.showShop && this.shopOptions.length === 0) {
      const allOptions = [
        { key: '1', label: '⚡ +0.1 Speed', apply: () => this.game.player.speed += 0.1 },
        { key: '2', label: '🎯 +5 Attack Range', apply: () => this.game.attackRange += 5 },
        { key: '3', label: '🪓 +1 Projectile', apply: () => this.game.projectileCount++ },
        { key: '4', label: '💨 +0.2 Attack Speed', apply: () => this.game.attackSpeed += 0.2 },
        { key: '5', label: '📏 +2 Pickup Range', apply: () => this.game.player.pickupRange += 2 }
      ];
      
      // Shuffle and take 3 random options, then renumber them sequentially
      this.shopOptions = allOptions
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((option, index) => ({
          ...option,
          key: (index + 1).toString()
        }));
      
      // Auto-shop if enabled
      const autoShopCheckbox = document.getElementById("autoShop") as HTMLInputElement;
      if (autoShopCheckbox && autoShopCheckbox.checked) {
        // Use setTimeout to allow the shop to render first
        setTimeout(() => {
          this.autoShop();
        }, 100);
      }
    }
    
    // For testing, always provide some options
    if (this.shopOptions.length === 0) {
      this.shopOptions = [
        { key: '1', label: '⚡ +0.1 Speed', apply: () => this.game.player.speed += 0.1 },
        { key: '2', label: '🎯 +5 Attack Range', apply: () => this.game.attackRange += 5 },
        { key: '3', label: '🪓 +1 Projectile', apply: () => this.game.projectileCount++ }
      ];
    }
    
    return this.shopOptions;
  }

  /**
   * Check if shop is open
   */
  public isShopOpen(): boolean {
    return this.game.showShop;
  }

  /**
   * Check if target level has been reached
   */
  public hasReachedLevel(targetLevel: number): boolean {
    return this.game.level >= targetLevel;
  }

  /**
   * Log game state for debugging
   */
  public logGameState(): void {
    const state = this.getGameState();
    console.log('Game State:', {
      time: state.gameTime.toFixed(1),
      level: state.level,
      score: state.score,
      enemiesKilled: state.enemiesKilled,
      xpCollected: state.xpCollected,
      heartsCollected: state.heartsCollected,
      axesThrown: state.axesThrown,
      enemiesSpawned: state.enemiesSpawned
    });
  }

  /**
   * Log performance statistics
   */
  public logPerformance(): void {
    const memory = this.getMemoryUsage();
    console.log('Memory Usage:', {
      enemies: `${memory.enemies}/${memory.maxEnemies}`,
      xpDrops: `${memory.xpDrops}/${memory.maxXpDrops}`,
      heartDrops: `${memory.heartDrops}/${memory.maxHeartDrops}`,
      axes: `${memory.axes}/${memory.maxAxes}`
    });
  }

  /**
   * Cleanup resources
   */
  public cleanup(): void {
    // Clear arrays to free memory
    this.game.enemies.length = 0;
    this.game.xpDrops.length = 0;
    this.game.heartDrops.length = 0;
    this.game.axes.length = 0;
  }
} 