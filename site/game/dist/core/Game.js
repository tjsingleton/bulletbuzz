import { Player } from './Player.js';
import { SpawnSystem } from '../systems/SpawnSystem.js';
import { CollisionSystem } from '../systems/CollisionSystem.js';
import { LevelSystem } from '../systems/LevelSystem.js';
/**
 * Core Game Class
 * Handles the main game loop, state management, and coordination between systems
 */
export class Game {
    // Timestep for systems
    get timestep() {
        return this._timestep;
    }
    constructor(config = {}) {
        // Game state
        this.gameTime = 0;
        this.level = 1;
        this.score = 0;
        this.enemiesKilled = 0;
        this.xpCollected = 0;
        this.heartsCollected = 0;
        this.axesThrown = 0;
        this.enemiesSpawned = 0;
        this.levelTimes = {};
        // Fixed timestep variables
        this.accumulator = 0;
        // Memory management - maximum array sizes
        this.maxEnemies = 100;
        this.maxXpDrops = 200;
        this.maxHeartDrops = 50;
        this.maxAxes = 50;
        this.enemies = [];
        this.xpDrops = [];
        this.heartDrops = [];
        this.axes = [];
        this._timestep = 1 / 60; // 60 FPS fixed timestep
        // Game mechanics
        this.paused = false;
        this.showShop = false;
        // Canvas dimensions (for bounds checking)
        this.canvasWidth = 800;
        this.canvasHeight = 600;
        // Initialize game parameters with defaults
        this.baseSpawnInterval = config.spawnInterval ?? 2000; // 2 seconds instead of 8
        this.enemySpeed = config.enemySpeed ?? 0.5; // Faster enemies for testing
        this.heartDropRate = config.heartDropRate ?? 0.20;
        this.avoidDistance = config.avoidDistance ?? 120;
        this.avoidStrength = config.avoidStrength ?? 2.0;
        this.fleeRange = config.fleeRange ?? 80;
        this.fleeStrength = config.fleeStrength ?? 1.5;
        this.singleEnemyLevel = config.singleEnemyLevel ?? 6;
        this.minSpawnInterval = config.minSpawnInterval ?? 1000; // 1 second instead of 4.5
        this.levelScaling = config.levelScaling ?? 1.2;
        this.earlyLevelScaling = config.earlyLevelScaling ?? 1.1;
        this.attackRange = config.attackRange ?? 150;
        this.projectileCount = config.projectileCount ?? 1;
        this.projectileSpeed = config.projectileSpeed ?? 3.0;
        this.attackSpeed = config.attackSpeed ?? 2.0; // 2 attacks per second instead of 1
        this.autoPathing = config.autoPathing ?? true;
        // Initialize player
        this.player = new Player(config);
        // Initialize systems
        this.spawnSystem = new SpawnSystem(this);
        this.collisionSystem = new CollisionSystem(this);
        this.levelSystem = new LevelSystem(this);
    }
    /**
     * Main game step - called with delta time
     */
    step(deltaTime = 1 / 60) {
        if (this.paused)
            return;
        // Fixed timestep accumulation
        this.accumulator += deltaTime;
        while (this.accumulator >= this.timestep) {
            this.update();
            this.accumulator -= this.timestep;
        }
    }
    /**
     * Update game state for one timestep
     */
    update() {
        this.gameTime += this.timestep;
        // Update systems
        this.spawnSystem.update();
        this.collisionSystem.update();
        this.levelSystem.update();
        // Update game objects
        this.updatePlayer();
        this.updateEnemies();
        this.updateProjectiles();
        this.updatePickups();
        // Cleanup expired objects
        this.cleanup();
    }
    updatePlayer() {
        this.player.update(this.timestep);
        // Handle AI movement if auto-pathing is enabled
        if (this.autoPathing) {
            this.player.moveWithAI(this.enemies, this.xpDrops, this.heartDrops);
        }
    }
    updateEnemies() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update(this.timestep);
            // Remove dead enemies
            if (enemy.hp <= 0) {
                this.enemies.splice(i, 1);
                this.enemiesKilled++;
            }
        }
    }
    updateProjectiles() {
        for (let i = this.axes.length - 1; i >= 0; i--) {
            const axe = this.axes[i];
            axe.update(this.timestep);
            // Remove expired axes
            if (axe.isExpired()) {
                this.axes.splice(i, 1);
            }
        }
    }
    updatePickups() {
        // Update XP drops
        for (let i = this.xpDrops.length - 1; i >= 0; i--) {
            const xp = this.xpDrops[i];
            xp.update(this.timestep, this.player.x, this.player.y, this.player.pickupRange);
            if (xp.isExpired()) {
                this.xpDrops.splice(i, 1);
            }
        }
        // Update heart drops
        for (let i = this.heartDrops.length - 1; i >= 0; i--) {
            const heart = this.heartDrops[i];
            heart.update(this.timestep, this.player.x, this.player.y, this.player.pickupRange);
            if (heart.isExpired()) {
                this.heartDrops.splice(i, 1);
            }
        }
    }
    cleanup() {
        // Enforce array size limits
        if (this.enemies.length > this.maxEnemies) {
            this.enemies.splice(0, this.enemies.length - this.maxEnemies);
        }
        if (this.xpDrops.length > this.maxXpDrops) {
            this.xpDrops.splice(0, this.xpDrops.length - this.maxXpDrops);
        }
        if (this.heartDrops.length > this.maxHeartDrops) {
            this.heartDrops.splice(0, this.heartDrops.length - this.maxHeartDrops);
        }
        if (this.axes.length > this.maxAxes) {
            this.axes.splice(0, this.axes.length - this.maxAxes);
        }
    }
    /**
     * Get current game state
     */
    getGameState() {
        return {
            gameTime: this.gameTime,
            level: this.level,
            score: this.score,
            player: this.player,
            enemiesKilled: this.enemiesKilled,
            xpCollected: this.xpCollected,
            heartsCollected: this.heartsCollected,
            axesThrown: this.axesThrown,
            enemiesSpawned: this.enemiesSpawned,
            enemiesCount: this.enemies.length,
            xpDropsCount: this.xpDrops.length,
            heartDropsCount: this.heartDrops.length,
            axesCount: this.axes.length,
            levelTimes: this.levelTimes
        };
    }
    /**
     * Get memory usage statistics
     */
    getMemoryUsage() {
        return {
            enemies: this.enemies.length,
            xpDrops: this.xpDrops.length,
            heartDrops: this.heartDrops.length,
            axes: this.axes.length,
            maxEnemies: this.maxEnemies,
            maxXpDrops: this.maxXpDrops,
            maxHeartDrops: this.maxHeartDrops,
            maxAxes: this.maxAxes
        };
    }
    /**
     * Reset game to initial state
     */
    reset() {
        this.gameTime = 0;
        this.level = 1;
        this.score = 0;
        this.enemiesKilled = 0;
        this.xpCollected = 0;
        this.heartsCollected = 0;
        this.axesThrown = 0;
        this.enemiesSpawned = 0;
        this.levelTimes = {};
        this.accumulator = 0;
        this.paused = false;
        this.showShop = false;
        // Reset player
        this.player.reset();
        // Clear arrays
        this.enemies = [];
        this.xpDrops = [];
        this.heartDrops = [];
        this.axes = [];
        // Reset systems
        this.spawnSystem.reset();
        this.collisionSystem.reset();
        this.levelSystem.reset();
    }
    /**
     * Check if game is over
     */
    isGameOver() {
        return this.player.hp <= 0;
    }
    /**
     * Set auto-pathing mode
     */
    setAutoPathing(enabled) {
        this.autoPathing = enabled;
    }
}
//# sourceMappingURL=Game.js.map