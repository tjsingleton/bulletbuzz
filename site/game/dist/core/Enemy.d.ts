import { Enemy as EnemyType } from '../types.js';
import { Player } from './Player.js';
/**
 * Enemy Class
 * Handles enemy state, movement, and behavior
 */
export declare class Enemy implements EnemyType {
    x: number;
    y: number;
    radius: number;
    speed: number;
    hp: number;
    maxHp: number;
    damage: number;
    xpValue: number;
    color: string;
    lifetime: number;
    private targetX;
    private targetY;
    private readonly canvasWidth;
    private readonly canvasHeight;
    constructor(x: number, y: number, level: number, speed: number);
    /**
     * Update enemy for one timestep
     */
    update(deltaTime: number): void;
    /**
     * Set target position (usually player position)
     */
    setTarget(x: number, y: number): void;
    /**
     * Take damage
     */
    takeDamage(damage: number): void;
    /**
     * Check if enemy is dead
     */
    isDead(): boolean;
    /**
     * Get distance to player
     */
    distanceToPlayer(player: Player): number;
    /**
     * Check collision with player
     */
    collidesWithPlayer(player: Player): boolean;
}
