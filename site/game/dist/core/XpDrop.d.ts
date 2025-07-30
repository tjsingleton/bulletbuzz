import { XpDrop as XpDropType } from '../types.js';
/**
 * XP Drop Class
 * Handles XP pickup items
 */
export declare class XpDrop implements XpDropType {
    x: number;
    y: number;
    radius: number;
    value: number;
    color: string;
    lifetime: number;
    collected: boolean;
    constructor(x: number, y: number, value?: number);
    /**
     * Update XP drop for one timestep
     */
    update(deltaTime: number, playerX?: number, playerY?: number, pickupRange?: number): void;
    /**
     * Check if XP drop is expired
     */
    isExpired(): boolean;
    /**
     * Collect the XP drop
     */
    collect(): number;
}
