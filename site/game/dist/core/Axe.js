/**
 * Axe Class
 * Handles projectile weapons
 */
export class Axe {
    constructor(x, y, targetX, targetY, speed, damage) {
        this.canvasWidth = 800;
        this.canvasHeight = 600;
        this.x = x;
        this.y = y;
        this.radius = 6;
        this.speed = speed;
        this.damage = damage;
        this.lifetime = 2.0; // 2 seconds
        this.color = '#8B4513'; // Brown color
        // Calculate velocity toward target
        const dx = targetX - x;
        const dy = targetY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 0) {
            this.velocityX = (dx / distance) * speed;
            this.velocityY = (dy / distance) * speed;
        }
        else {
            this.velocityX = 0;
            this.velocityY = speed;
        }
    }
    /**
     * Update axe for one timestep
     */
    update(deltaTime) {
        this.lifetime -= deltaTime;
        // Move axe
        this.x += this.velocityX;
        this.y += this.velocityY;
        // Expire axe if it hits screen edges
        if (this.x < 0 || this.x > this.canvasWidth ||
            this.y < 0 || this.y > this.canvasHeight) {
            this.lifetime = 0; // Force expiration
        }
    }
    /**
     * Check if axe is expired
     */
    isExpired() {
        return this.lifetime <= 0;
    }
    /**
     * Get current position
     */
    getPosition() {
        return { x: this.x, y: this.y };
    }
}
//# sourceMappingURL=Axe.js.map