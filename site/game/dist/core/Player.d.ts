import { GameConfig, Player as PlayerType } from '../types.js';
import { Enemy } from './Enemy.js';
import { XpDrop } from './XpDrop.js';
import { HeartDrop } from './HeartDrop.js';
/**
 * Player Class
 * Handles player state, movement, and AI behavior
 */
export declare class Player implements PlayerType {
    hp: number;
    maxHp: number;
    x: number;
    y: number;
    radius: number;
    speed: number;
    pickupRange: number;
    attackRange: number;
    hitTimer: number;
    private wanderDirection;
    private wanderTimer;
    private readonly wanderInterval;
    private lastKilledEnemy;
    private readonly canvasWidth;
    private readonly canvasHeight;
    constructor(config?: GameConfig);
    /**
     * Update player for one timestep
     */
    update(deltaTime: number): void;
    /**
     * Move player with AI pathfinding
     */
    moveWithAI(enemies: Enemy[], xpDrops: XpDrop[], heartDrops: HeartDrop[]): void;
    /**
     * Take damage from enemy
     */
    takeDamage(damage: number): void;
    /**
     * Heal player
     */
    heal(amount: number): void;
    /**
     * Set last killed enemy position for pathfinding
     */
    setLastKilledEnemy(x: number, y: number): void;
    /**
     * Reset player to initial state
     */
    reset(): void;
}
