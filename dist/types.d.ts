export interface GameConfig {
    startHp?: number;
    pickupRange?: number;
    playerSpeed?: number;
    enemySpeed?: number;
    spawnInterval?: number;
    heartDropRate?: number;
    avoidDistance?: number;
    avoidStrength?: number;
    fleeRange?: number;
    fleeStrength?: number;
    singleEnemyLevel?: number;
    minSpawnInterval?: number;
    levelScaling?: number;
    earlyLevelScaling?: number;
    attackRange?: number;
    projectileCount?: number;
    projectileSpeed?: number;
    attackSpeed?: number;
    autoPathing?: boolean;
}
export interface Player {
    x: number;
    y: number;
    radius: number;
    speed: number;
    hp: number;
    maxHp: number;
    pickupRange: number;
    attackRange: number;
    hitTimer: number;
}
export interface Enemy {
    x: number;
    y: number;
    radius: number;
    speed: number;
    type: 'bee' | 'wasp';
    hp: number;
    maxHp: number;
    attackCooldown: number;
    lifetime: number;
}
export interface XpDrop {
    x: number;
    y: number;
    r: number;
    lifetime: number;
}
export interface HeartDrop {
    x: number;
    y: number;
    r: number;
    lifetime: number;
}
export interface Axe {
    x: number;
    y: number;
    vx: number;
    vy: number;
    rotation: number;
    lifetime: number;
}
export interface ShopOption {
    key: string;
    label: string;
    apply: () => void;
}
export interface GameState {
    gameTime: number;
    level: number;
    score: number;
    player: Player;
    enemiesKilled: number;
    xpCollected: number;
    heartsCollected: number;
    axesThrown: number;
    enemiesSpawned: number;
    levelTimes: Record<number, string>;
    enemiesCount: number;
    xpDropsCount: number;
    heartDropsCount: number;
    axesCount: number;
}
export interface MemoryUsage {
    enemies: number;
    xpDrops: number;
    heartDrops: number;
    axes: number;
    maxEnemies: number;
    maxXpDrops: number;
    maxHeartDrops: number;
    maxAxes: number;
}
