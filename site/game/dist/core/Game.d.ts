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
export declare class Game {
    gameTime: number;
    level: number;
    score: number;
    enemiesKilled: number;
    xpCollected: number;
    heartsCollected: number;
    axesThrown: number;
    enemiesSpawned: number;
    levelTimes: Record<number, string>;
    private accumulator;
    private readonly maxEnemies;
    private readonly maxXpDrops;
    private readonly maxHeartDrops;
    private readonly maxAxes;
    player: Player;
    enemies: Enemy[];
    xpDrops: XpDrop[];
    heartDrops: HeartDrop[];
    axes: Axe[];
    baseSpawnInterval: number;
    enemySpeed: number;
    heartDropRate: number;
    avoidDistance: number;
    avoidStrength: number;
    fleeRange: number;
    fleeStrength: number;
    singleEnemyLevel: number;
    minSpawnInterval: number;
    levelScaling: number;
    earlyLevelScaling: number;
    attackRange: number;
    projectileCount: number;
    projectileSpeed: number;
    attackSpeed: number;
    get timestep(): number;
    private readonly _timestep;
    paused: boolean;
    showShop: boolean;
    autoPathing: boolean;
    spawnSystem: SpawnSystem;
    collisionSystem: CollisionSystem;
    levelSystem: LevelSystem;
    readonly canvasWidth: number;
    readonly canvasHeight: number;
    constructor(config?: GameConfig);
    /**
     * Main game step - called with delta time
     */
    step(deltaTime?: number): void;
    /**
     * Update game state for one timestep
     */
    private update;
    private updatePlayer;
    private updateEnemies;
    private updateProjectiles;
    private updatePickups;
    private cleanup;
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
}
