/**
 * Collision System
 * Handles all collision detection and resolution
 */
export class CollisionSystem {
    constructor(game) {
        this.game = game;
    }
    /**
     * Update collision system for one timestep
     */
    update() {
        this.checkPlayerEnemyCollisions();
        this.checkPlayerPickupCollisions();
        this.checkProjectileEnemyCollisions();
        this.updateEnemyTargets();
    }
    /**
     * Check collisions between player and enemies
     */
    checkPlayerEnemyCollisions() {
        const player = this.game.player;
        for (const enemy of this.game.enemies) {
            if (enemy.collidesWithPlayer(player) && player.hitTimer <= 0) {
                player.takeDamage(enemy.damage);
            }
        }
    }
    /**
     * Check collisions between player and pickups
     */
    checkPlayerPickupCollisions() {
        const player = this.game.player;
        // Check XP drops
        for (let i = this.game.xpDrops.length - 1; i >= 0; i--) {
            const xp = this.game.xpDrops[i];
            const distance = Math.sqrt((player.x - xp.x) ** 2 + (player.y - xp.y) ** 2);
            // Only collect when actually colliding with player (not just in pickup range)
            if (distance < xp.radius) {
                const value = xp.collect();
                if (value > 0) {
                    this.game.xpCollected += value;
                    this.game.levelSystem.addXp(value); // Add XP to level system
                    this.game.xpDrops.splice(i, 1);
                }
            }
        }
        // Check heart drops
        for (let i = this.game.heartDrops.length - 1; i >= 0; i--) {
            const heart = this.game.heartDrops[i];
            const distance = Math.sqrt((player.x - heart.x) ** 2 + (player.y - heart.y) ** 2);
            // Only collect when actually colliding with player (not just in pickup range)
            if (distance < heart.radius) {
                const healAmount = heart.collect();
                if (healAmount > 0) {
                    player.heal(healAmount);
                    this.game.heartsCollected++;
                    this.game.heartDrops.splice(i, 1);
                }
            }
        }
    }
    /**
     * Check collisions between projectiles and enemies
     */
    checkProjectileEnemyCollisions() {
        for (let i = this.game.axes.length - 1; i >= 0; i--) {
            const axe = this.game.axes[i];
            for (let j = this.game.enemies.length - 1; j >= 0; j--) {
                const enemy = this.game.enemies[j];
                const distance = Math.sqrt((axe.x - enemy.x) ** 2 + (axe.y - enemy.y) ** 2);
                if (distance < axe.radius + enemy.radius) {
                    // Hit enemy
                    enemy.takeDamage(axe.damage);
                    // Remove axe
                    this.game.axes.splice(i, 1);
                    // Check if enemy died
                    if (enemy.isDead()) {
                        // Spawn drops at enemy location
                        this.game.spawnSystem.spawnXpDrop(enemy.x, enemy.y, enemy.xpValue);
                        this.game.spawnSystem.spawnHeartDrop(enemy.x, enemy.y);
                        // Set last killed enemy position for player pathfinding
                        this.game.player.setLastKilledEnemy(enemy.x, enemy.y);
                        // Remove enemy
                        this.game.enemies.splice(j, 1);
                        this.game.enemiesKilled++;
                    }
                    break; // Axe can only hit one enemy
                }
            }
        }
    }
    /**
     * Update enemy targets to follow player
     */
    updateEnemyTargets() {
        const player = this.game.player;
        for (const enemy of this.game.enemies) {
            enemy.setTarget(player.x, player.y);
        }
    }
    /**
     * Reset collision system
     */
    reset() {
        // No state to reset in collision system
    }
}
//# sourceMappingURL=CollisionSystem.js.map