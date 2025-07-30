import { HeartDrop as HeartDropType } from '../types.js';

/**
 * Heart Drop Class
 * Handles heart pickup items for healing
 */
export class HeartDrop implements HeartDropType {
  public x: number;
  public y: number;
  public radius: number;
  public healAmount: number;
  public color: string;
  public lifetime: number;
  public collected: boolean;

  constructor(x: number, y: number, healAmount: number = 2) {
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.healAmount = healAmount;
    this.color = '#FF6B6B'; // Red color
    this.lifetime = 15.0; // 15 seconds
    this.collected = false;
  }

  /**
   * Update heart drop for one timestep
   */
  public update(deltaTime: number, playerX?: number, playerY?: number, pickupRange?: number): void {
    this.lifetime -= deltaTime;
    
    // Attract to player if in pickup range
    if (playerX !== undefined && playerY !== undefined && pickupRange !== undefined) {
      const distance = Math.sqrt((this.x - playerX) ** 2 + (this.y - playerY) ** 2);
      
      if (distance < pickupRange) {
        // Calculate attraction force
        const attractionSpeed = 2.0; // Speed at which drops move toward player
        const dx = playerX - this.x;
        const dy = playerY - this.y;
        const distanceToPlayer = Math.sqrt(dx * dx + dy * dy);
        
        if (distanceToPlayer > 0) {
          // Normalize and apply attraction
          const normalizedDx = dx / distanceToPlayer;
          const normalizedDy = dy / distanceToPlayer;
          
          this.x += normalizedDx * attractionSpeed * deltaTime;
          this.y += normalizedDy * attractionSpeed * deltaTime;
        }
      }
    }
  }

  /**
   * Check if heart drop is expired
   */
  public isExpired(): boolean {
    return this.lifetime <= 0;
  }

  /**
   * Collect the heart drop
   */
  public collect(): number {
    if (!this.collected) {
      this.collected = true;
      return this.healAmount;
    }
    return 0;
  }
} 