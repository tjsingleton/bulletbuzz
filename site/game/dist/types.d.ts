/**
 * Configuration options for the BulletBuzz game
 * @category Game Configuration
 */
export interface GameConfig {
    /** Starting health points for the player (default: 10) */
    startHp?: number;
    /** Range at which player can pick up items (default: 25) */
    pickupRange?: number;
    /** Player movement speed (default: 0.85) */
    playerSpeed?: number;
    /** Enemy movement speed (default: 0.15) */
    enemySpeed?: number;
    /** Time interval between enemy spawns in seconds (default: 8) */
    spawnInterval?: number;
    /** Probability of heart drops (0-1, default: 0.3) */
    heartDropRate?: number;
    /** Distance at which AI avoids walls (default: 120) */
    avoidDistance?: number;
    /** Strength of wall avoidance (default: 2.0) */
    avoidStrength?: number;
    /** Range at which AI flees from enemies (default: 50) */
    fleeRange?: number;
    /** Strength of flee behavior (default: 1.5) */
    fleeStrength?: number;
    /** Level at which multiple enemies start spawning (default: 6) */
    singleEnemyLevel?: number;
    /** Minimum spawn interval in seconds (default: 2) */
    minSpawnInterval?: number;
    /** Difficulty scaling per level (default: 0.15) */
    levelScaling?: number;
    /** Early level scaling (default: 0.05) */
    earlyLevelScaling?: number;
    /** Player attack range (default: 150) */
    attackRange?: number;
    /** Number of projectiles player can have (default: 3) */
    projectileCount?: number;
    /** Speed of projectiles (default: 3.0) */
    projectileSpeed?: number;
    /** Attack speed in attacks per second (default: 1.0) */
    attackSpeed?: number;
    /** Whether auto-pathing is enabled (default: true) */
    autoPathing?: boolean;
}
/**
 * Player character data
 * @category Game Entities
 */
export interface Player {
    /** X coordinate position */
    x: number;
    /** Y coordinate position */
    y: number;
    /** Collision radius */
    radius: number;
    /** Movement speed */
    speed: number;
    /** Current health points */
    hp: number;
    /** Maximum health points */
    maxHp: number;
    /** Range at which items are attracted */
    pickupRange: number;
    /** Range at which player can attack */
    attackRange: number;
    /** Timer for hit cooldown */
    hitTimer: number;
}
/**
 * Enemy entity data
 * @category Game Entities
 */
export interface Enemy {
    /** X coordinate position */
    x: number;
    /** Y coordinate position */
    y: number;
    /** Collision radius */
    radius: number;
    /** Movement speed */
    speed: number;
    /** Current health points */
    hp: number;
    /** Maximum health points */
    maxHp: number;
    /** Damage dealt to player on contact */
    damage: number;
    /** XP value when killed */
    xpValue: number;
    /** Visual color */
    color: string;
    /** Time until auto-destruction */
    lifetime: number;
}
/**
 * XP drop entity data
 * @category Game Entities
 */
export interface XpDrop {
    /** X coordinate position */
    x: number;
    /** Y coordinate position */
    y: number;
    /** Collision radius */
    radius: number;
    /** XP value when collected */
    value: number;
    /** Visual color */
    color: string;
    /** Time until auto-destruction */
    lifetime: number;
    /** Whether this drop has been collected */
    collected: boolean;
}
/**
 * Heart drop entity data
 * @category Game Entities
 */
export interface HeartDrop {
    /** X coordinate position */
    x: number;
    /** Y coordinate position */
    y: number;
    /** Collision radius */
    radius: number;
    /** Health restored when collected */
    healAmount: number;
    /** Visual color */
    color: string;
    /** Time until auto-destruction */
    lifetime: number;
    /** Whether this drop has been collected */
    collected: boolean;
}
/**
 * Axe projectile data
 * @category Game Entities
 */
export interface Axe {
    /** X coordinate position */
    x: number;
    /** Y coordinate position */
    y: number;
    /** Collision radius */
    radius: number;
    /** Movement speed */
    speed: number;
    /** Damage dealt to enemies */
    damage: number;
    /** Time until auto-destruction */
    lifetime: number;
    /** Visual color */
    color: string;
}
/**
 * Shop upgrade option
 * @category Game Systems
 */
export interface ShopOption {
    /** Unique key identifier */
    key: string;
    /** Display label */
    label: string;
    /** Function to apply the upgrade */
    apply: () => void;
}
/**
 * Current game state data
 * @category Game State
 */
export interface GameState {
    /** Total game time in seconds */
    gameTime: number;
    /** Current level */
    level: number;
    /** Current score */
    score: number;
    /** Player data */
    player: Player;
    /** Total enemies killed */
    enemiesKilled: number;
    /** Total XP collected */
    xpCollected: number;
    /** Total hearts collected */
    heartsCollected: number;
    /** Total axes thrown */
    axesThrown: number;
    /** Total enemies spawned */
    enemiesSpawned: number;
    /** Record of level completion times */
    levelTimes: Record<number, string>;
    /** Current number of enemies */
    enemiesCount: number;
    /** Current number of XP drops */
    xpDropsCount: number;
    /** Current number of heart drops */
    heartDropsCount: number;
    /** Current number of axes */
    axesCount: number;
}
/**
 * Memory usage statistics
 * @category Game State
 */
export interface MemoryUsage {
    /** Current number of enemies */
    enemies: number;
    /** Current number of XP drops */
    xpDrops: number;
    /** Current number of heart drops */
    heartDrops: number;
    /** Current number of axes */
    axes: number;
    /** Maximum enemies seen */
    maxEnemies: number;
    /** Maximum XP drops seen */
    maxXpDrops: number;
    /** Maximum heart drops seen */
    maxHeartDrops: number;
    /** Maximum axes seen */
    maxAxes: number;
}
