import { Axe as AxeType } from '../types.js';
/**
 * Axe Class
 * Handles projectile weapons
 */
export declare class Axe implements AxeType {
    x: number;
    y: number;
    radius: number;
    speed: number;
    damage: number;
    lifetime: number;
    color: string;
    private velocityX;
    private velocityY;
    private readonly canvasWidth;
    private readonly canvasHeight;
    constructor(x: number, y: number, targetX: number, targetY: number, speed: number, damage: number);
    /**
     * Update axe for one timestep
     */
    update(deltaTime: number): void;
    /**
     * Check if axe is expired
     */
    isExpired(): boolean;
    /**
     * Get current position
     */
    getPosition(): {
        x: number;
        y: number;
    };
}
