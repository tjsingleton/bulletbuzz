import { Game } from '../core/Game.js';
/**
 * Spawn System
 * Handles enemy spawning and pickup generation
 */
export declare class SpawnSystem {
    private game;
    private spawnTimer;
    private readonly canvasWidth;
    private readonly canvasHeight;
    constructor(game: Game);
    /**
     * Update spawn system for one timestep
     */
    update(): void;
    /**
     * Spawn a new enemy
     */
    private spawnEnemy;
    /**
     * Spawn XP drop at enemy death location
     */
    spawnXpDrop(x: number, y: number, value?: number): void;
    /**
     * Spawn heart drop at enemy death location (random chance)
     */
    spawnHeartDrop(x: number, y: number): void;
    /**
     * Reset spawn system
     */
    reset(): void;
}
