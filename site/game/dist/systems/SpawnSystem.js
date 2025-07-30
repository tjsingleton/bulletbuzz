import { Enemy } from '../core/Enemy.js';
import { XpDrop } from '../core/XpDrop.js';
import { HeartDrop } from '../core/HeartDrop.js';
/**
 * Spawn System
 * Handles enemy spawning and pickup generation
 */
export class SpawnSystem {
    constructor(game) {
        this.spawnTimer = 0;
        this.canvasWidth = 800;
        this.canvasHeight = 600;
        this.game = game;
    }
    /**
     * Update spawn system for one timestep
     */
    update() {
        this.spawnTimer += this.game.timestep;
        // Calculate spawn interval based on level (in seconds)
        const spawnInterval = Math.max(this.game.minSpawnInterval / 1000, // Convert to seconds
        (this.game.baseSpawnInterval - (this.game.level - 1) * 100) / 1000);
        // For testing, use a shorter interval
        const testInterval = Math.min(spawnInterval, 0.5); // Max 0.5 seconds for testing
        if (this.spawnTimer >= testInterval) {
            this.spawnEnemy();
            this.spawnTimer = 0;
        }
    }
    /**
     * Spawn a new enemy
     */
    spawnEnemy() {
        // Spawn from edges
        let x, y;
        const side = Math.floor(Math.random() * 4);
        switch (side) {
            case 0: // Top
                x = Math.random() * this.canvasWidth;
                y = -20;
                break;
            case 1: // Right
                x = this.canvasWidth + 20;
                y = Math.random() * this.canvasHeight;
                break;
            case 2: // Bottom
                x = Math.random() * this.canvasWidth;
                y = this.canvasHeight + 20;
                break;
            default: // Left
                x = -20;
                y = Math.random() * this.canvasHeight;
                break;
        }
        const enemy = new Enemy(x, y, this.game.level, this.game.enemySpeed);
        this.game.enemies.push(enemy);
        this.game.enemiesSpawned++;
    }
    /**
     * Spawn XP drop at enemy death location
     */
    spawnXpDrop(x, y, value = 1) {
        const xpDrop = new XpDrop(x, y, value);
        this.game.xpDrops.push(xpDrop);
    }
    /**
     * Spawn heart drop at enemy death location (random chance)
     */
    spawnHeartDrop(x, y) {
        if (Math.random() < this.game.heartDropRate) {
            const heartDrop = new HeartDrop(x, y);
            this.game.heartDrops.push(heartDrop);
        }
    }
    /**
     * Reset spawn system
     */
    reset() {
        this.spawnTimer = 0;
    }
}
//# sourceMappingURL=SpawnSystem.js.map