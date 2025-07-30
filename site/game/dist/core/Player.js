/**
 * Player Class
 * Handles player state, movement, and AI behavior
 */
export class Player {
    constructor(config = {}) {
        // AI behavior
        this.wanderDirection = Math.random() * 2 * Math.PI;
        this.wanderTimer = 0;
        this.wanderInterval = 180;
        this.lastKilledEnemy = null;
        // Canvas dimensions
        this.canvasWidth = 800;
        this.canvasHeight = 600;
        this.hp = config.startHp ?? 10;
        this.maxHp = config.startHp ?? 10;
        this.x = this.canvasWidth / 2;
        this.y = this.canvasHeight / 2;
        this.radius = 15;
        this.speed = config.playerSpeed ?? 0.85;
        this.pickupRange = config.pickupRange ?? 25;
        this.attackRange = config.attackRange ?? 150;
        this.hitTimer = 0;
    }
    /**
     * Update player for one timestep
     */
    update(deltaTime) {
        // Update hit timer
        if (this.hitTimer > 0) {
            this.hitTimer -= deltaTime;
        }
    }
    /**
     * Move player with AI pathfinding
     */
    moveWithAI(enemies, xpDrops, heartDrops) {
        let targetX = this.x;
        let targetY = this.y;
        // Find closest XP drop
        let closestXp = null;
        let closestXpDistance = Infinity;
        for (const xp of xpDrops) {
            const distance = Math.sqrt((this.x - xp.x) ** 2 + (this.y - xp.y) ** 2);
            if (distance < closestXpDistance) {
                closestXpDistance = distance;
                closestXp = xp;
            }
        }
        // Find closest heart drop
        let closestHeart = null;
        let closestHeartDistance = Infinity;
        for (const heart of heartDrops) {
            const distance = Math.sqrt((this.x - heart.x) ** 2 + (this.y - heart.y) ** 2);
            if (distance < closestHeartDistance) {
                closestHeartDistance = distance;
                closestHeart = heart;
            }
        }
        // Calculate avoidance vector from enemies
        let avoidX = 0;
        let avoidY = 0;
        for (const enemy of enemies) {
            const distance = Math.sqrt((this.x - enemy.x) ** 2 + (this.y - enemy.y) ** 2);
            if (distance < 120) { // Avoidance distance
                const angle = Math.atan2(this.y - enemy.y, this.x - enemy.x);
                const strength = 2.0 * (1 - distance / 120);
                avoidX += Math.cos(angle) * strength;
                avoidY += Math.sin(angle) * strength;
            }
            if (distance < 80) { // Flee distance
                const angle = Math.atan2(this.y - enemy.y, this.x - enemy.x);
                const strength = 1.5 * (1 - distance / 80);
                avoidX += Math.cos(angle) * strength;
                avoidY += Math.sin(angle) * strength;
            }
        }
        // Determine target based on priority
        if (closestHeart && closestHeartDistance < 100) {
            // Prioritize hearts when low on HP
            targetX = closestHeart.x;
            targetY = closestHeart.y;
        }
        else if (closestXp && closestXpDistance < 200) {
            // Collect XP drops
            targetX = closestXp.x;
            targetY = closestXp.y;
        }
        else if (this.lastKilledEnemy) {
            // Move toward last killed enemy position
            targetX = this.lastKilledEnemy.x;
            targetY = this.lastKilledEnemy.y;
            // Clear lastKilledEnemy if we're close to it
            const distanceToLastKill = Math.sqrt((this.x - this.lastKilledEnemy.x) ** 2 + (this.y - this.lastKilledEnemy.y) ** 2);
            if (distanceToLastKill < 30) {
                this.lastKilledEnemy = null;
            }
        }
        else {
            // Wander randomly
            this.wanderTimer++;
            if (this.wanderTimer > this.wanderInterval) {
                this.wanderDirection = Math.random() * 2 * Math.PI;
                this.wanderTimer = 0;
            }
            targetX = this.x + Math.cos(this.wanderDirection) * 50;
            targetY = this.y + Math.sin(this.wanderDirection) * 50;
        }
        // Calculate movement direction
        let moveX = targetX - this.x;
        let moveY = targetY - this.y;
        // Apply avoidance
        moveX += avoidX;
        moveY += avoidY;
        // Normalize and apply speed
        const distance = Math.sqrt(moveX ** 2 + moveY ** 2);
        if (distance > 0) {
            moveX = (moveX / distance) * this.speed;
            moveY = (moveY / distance) * this.speed;
        }
        // Update position
        this.x += moveX;
        this.y += moveY;
        // Keep within bounds
        this.x = Math.max(this.radius, Math.min(this.canvasWidth - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(this.canvasHeight - this.radius, this.y));
    }
    /**
     * Take damage from enemy
     */
    takeDamage(damage) {
        this.hp = Math.max(0, this.hp - damage);
        this.hitTimer = 0.5; // Invulnerability time
    }
    /**
     * Heal player
     */
    heal(amount) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
    }
    /**
     * Set last killed enemy position for pathfinding
     */
    setLastKilledEnemy(x, y) {
        this.lastKilledEnemy = { x, y };
    }
    /**
     * Reset player to initial state
     */
    reset() {
        this.hp = this.maxHp;
        this.x = this.canvasWidth / 2;
        this.y = this.canvasHeight / 2;
        this.hitTimer = 0;
        this.wanderDirection = Math.random() * 2 * Math.PI;
        this.wanderTimer = 0;
        this.lastKilledEnemy = null;
    }
}
//# sourceMappingURL=Player.js.map