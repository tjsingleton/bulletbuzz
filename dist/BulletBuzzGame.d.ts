import { GameConfig, Player, Enemy, XpDrop, HeartDrop, Axe, ShopOption, GameState, MemoryUsage } from './types';
/**
 * BulletBuzz Core Game Logic
 * A headless version for testing and simulation
 *
 * Core Features:
 * - Auto-pathing player that collects XP and avoids enemies
 * - Enemy spawning and movement
 * - XP-based leveling system
 * - Heart drops for healing
 * - Auto-attacking with axes
 * - Configurable balance parameters
 * - Fixed timestep game loop for consistent performance
 */
export declare class BulletBuzzGame {
    private gameTime;
    private level;
    private score;
    private enemiesKilled;
    private xpCollected;
    private heartsCollected;
    private axesThrown;
    private enemiesSpawned;
    private levelTimes;
    private accumulator;
    private readonly timestep;
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
    private spawnTimer;
    paused: boolean;
    showShop: boolean;
    private attackTimer;
    autoPathing: boolean;
    private wanderDirection;
    private wanderTimer;
    private readonly wanderInterval;
    private lastKilledEnemy;
    readonly canvasWidth: number;
    readonly canvasHeight: number;
    shopOptions: ShopOption[];
    private readonly upgradePool;
    constructor(config?: GameConfig);
    private spawnEnemy;
    private conditionalSpawn;
    private shootAxe;
    private update;
    step(deltaTime?: number): void;
    reset(): void;
    cleanup(): void;
    getMemoryUsage(): MemoryUsage;
    getGameState(): GameState;
    isGameOver(): boolean;
    hasReachedLevel(targetLevel: number): boolean;
    setAutoPathing(enabled: boolean): void;
    selectShopOption(key: string): void;
    autoShop(): void;
    getShopOptions(): ShopOption[];
    isShopOpen(): boolean;
}
