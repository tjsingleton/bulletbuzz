import { GameConfig, GameState, MemoryUsage, ShopOption } from './types.js';
/**
 * BulletBuzzGame - Main Game Interface
 * Provides a clean API for the modular game architecture
 */
export declare class BulletBuzzGame {
    private game;
    canvasWidth: number;
    canvasHeight: number;
    private shopOptions;
    constructor(config?: GameConfig);
    /**
     * Step the game forward by delta time
     */
    step(deltaTime?: number): void;
    /**
     * Get current game state
     */
    getGameState(): GameState;
    /**
     * Get memory usage statistics
     */
    getMemoryUsage(): MemoryUsage;
    /**
     * Reset game to initial state
     */
    reset(): void;
    /**
     * Check if game is over
     */
    isGameOver(): boolean;
    /**
     * Set auto-pathing mode
     */
    setAutoPathing(enabled: boolean): void;
    /**
     * Set canvas dimensions
     */
    setCanvasDimensions(width: number, height: number): void;
    /**
     * Get auto-pathing status
     */
    get autoPathing(): boolean;
    /**
     * Select shop option
     */
    selectShopOption(key: string): void;
    /**
     * Auto-select shop option
     */
    autoShop(): void;
    /**
     * Get available shop options
     */
    getShopOptions(): ShopOption[];
    /**
     * Check if shop is open
     */
    isShopOpen(): boolean;
    /**
     * Check if target level has been reached
     */
    hasReachedLevel(targetLevel: number): boolean;
    /**
     * Log game state for debugging
     */
    logGameState(): void;
    /**
     * Log performance statistics
     */
    logPerformance(): void;
    /**
     * Cleanup resources
     */
    cleanup(): void;
}
