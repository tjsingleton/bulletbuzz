import { Game } from '../core/Game.js';
/**
 * Level System
 * Handles level progression, XP management, and automatic attacks
 */
export declare class LevelSystem {
    private game;
    private attackTimer;
    private xpToNextLevel;
    private currentXp;
    constructor(game: Game);
    /**
     * Update level system for one timestep
     */
    update(): void;
    /**
     * Handle XP collection and level progression
     */
    private handleLevelProgression;
    /**
     * Level up the player
     */
    private levelUp;
    /**
     * Handle automatic axe throwing
     */
    private handleAutomaticAttacks;
    /**
     * Throw axes at nearby enemies
     */
    private throwAxes;
    /**
     * Add XP to the player
     */
    addXp(amount: number): void;
    /**
     * Get current XP progress
     */
    getXpProgress(): {
        current: number;
        required: number;
        level: number;
    };
    /**
     * Check if target level has been reached
     */
    hasReachedLevel(targetLevel: number): boolean;
    /**
     * Reset level system
     */
    reset(): void;
}
