import { Axe as AxeType } from '../types.js';

/**
 * Axe Class
 * Handles projectile weapons
 */
export class Axe implements AxeType {
  public x: number;
  public y: number;
  public radius: number;
  public speed: number;
  public damage: number;
  public lifetime: number;
  public color: string;
  
  // Movement
  private velocityX: number;
  private velocityY: number;
  private readonly canvasWidth: number = 800;
  private readonly canvasHeight: number = 600;

  constructor(x: number, y: number, targetX: number, targetY: number, speed: number, damage: number) {
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
    } else {
      this.velocityX = 0;
      this.velocityY = speed;
    }
  }

  /**
   * Update axe for one timestep
   */
  public update(deltaTime: number): void {
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
  public isExpired(): boolean {
    return this.lifetime <= 0;
  }

  /**
   * Get current position
   */
  public getPosition(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }
} 