import { XpDrop as XpDropType } from '../types.js';

/**
 * XP Drop Class
 * Handles XP pickup items
 */
export class XpDrop implements XpDropType {
  public x: number;
  public y: number;
  public radius: number;
  public value: number;
  public color: string;
  public lifetime: number;
  public collected: boolean;

  constructor(x: number, y: number, value: number = 1) {
    this.x = x;
    this.y = y;
    this.radius = 8;
    this.value = value;
    this.color = '#FFD700'; // Gold color
    this.lifetime = 10.0; // 10 seconds
    this.collected = false;
  }

  /**
   * Update XP drop for one timestep
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
   * Check if XP drop is expired
   */
  public isExpired(): boolean {
    return this.lifetime <= 0;
  }

  /**
   * Collect the XP drop
   */
  public collect(): number {
    if (!this.collected) {
      this.collected = true;
      return this.value;
    }
    return 0;
  }
} 