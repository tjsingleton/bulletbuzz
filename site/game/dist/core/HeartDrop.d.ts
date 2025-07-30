import { HeartDrop as HeartDropType } from '../types.js';
/**
 * Heart Drop Class
 * Handles heart pickup items for healing
 */
export declare class HeartDrop implements HeartDropType {
    x: number;
    y: number;
    radius: number;
    healAmount: number;
    color: string;
    lifetime: number;
    collected: boolean;
    constructor(x: number, y: number, healAmount?: number);
    /**
     * Update heart drop for one timestep
     */
    update(deltaTime: number, playerX?: number, playerY?: number, pickupRange?: number): void;
    /**
     * Check if heart drop is expired
     */
    isExpired(): boolean;
    /**
     * Collect the heart drop
     */
    collect(): number;
}
