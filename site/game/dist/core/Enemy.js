/**
 * Enemy Class
 * Handles enemy state, movement, and behavior
 */
export class Enemy {
    constructor(x, y, level, speed) {
        this.canvasWidth = 800;
        this.canvasHeight = 600;
        this.x = x;
        this.y = y;
        this.radius = 12 + level * 0.5;
        this.speed = speed;
        this.hp = 1 + level * 0.5;
        this.maxHp = this.hp;
        this.damage = 1;
        this.xpValue = 1;
        this.color = `hsl(${200 + level * 10}, 70%, 50%)`;
        this.lifetime = 300; // 5 seconds at 60 FPS
        // Set initial target
        this.targetX = x;
        this.targetY = y;
    }
    /**
     * Update enemy for one timestep
     */
    update(deltaTime) {
        this.lifetime -= deltaTime;
        // Move toward target
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 0) {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }
        // Keep within bounds
        this.x = Math.max(this.radius, Math.min(this.canvasWidth - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(this.canvasHeight - this.radius, this.y));
    }
    /**
     * Set target position (usually player position)
     */
    setTarget(x, y) {
        this.targetX = x;
        this.targetY = y;
    }
    /**
     * Take damage
     */
    takeDamage(damage) {
        this.hp = Math.max(0, this.hp - damage);
    }
    /**
     * Check if enemy is dead
     */
    isDead() {
        return this.hp <= 0 || this.lifetime <= 0;
    }
    /**
     * Get distance to player
     */
    distanceToPlayer(player) {
        return Math.sqrt((this.x - player.x) ** 2 + (this.y - player.y) ** 2);
    }
    /**
     * Check collision with player
     */
    collidesWithPlayer(player) {
        const distance = this.distanceToPlayer(player);
        return distance < this.radius + player.radius;
    }
}
//# sourceMappingURL=Enemy.js.map