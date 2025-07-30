import { Game } from '../core/Game.js';
/**
 * Collision System
 * Handles all collision detection and resolution
 */
export declare class CollisionSystem {
    private game;
    constructor(game: Game);
    /**
     * Update collision system for one timestep
     */
    update(): void;
    /**
     * Check collisions between player and enemies
     */
    private checkPlayerEnemyCollisions;
    /**
     * Check collisions between player and pickups
     */
    private checkPlayerPickupCollisions;
    /**
     * Check collisions between projectiles and enemies
     */
    private checkProjectileEnemyCollisions;
    /**
     * Update enemy targets to follow player
     */
    private updateEnemyTargets;
    /**
     * Reset collision system
     */
    reset(): void;
}
