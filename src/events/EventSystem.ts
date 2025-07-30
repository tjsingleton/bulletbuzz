/**
 * Event System for BulletBuzz
 * 
 * Provides a decoupled event-driven architecture for game systems.
 * Allows components to communicate without direct dependencies.
 * 
 * @example
 * ```typescript
 * // Subscribe to events
 * EventSystem.on('enemyKilled', (data) => {
 *   console.log(`Enemy killed: ${data.enemyType}`);
 * });
 * 
 * // Emit events
 * EventSystem.emit('enemyKilled', { enemyType: 'bee', x: 100, y: 200 });
 * ```
 */

export interface GameEvent {
  type: string;
  timestamp: number;
  data?: any;
}

export interface EventListener {
  id: string;
  eventType: string;
  callback: (data?: any) => void;
  once?: boolean;
}

/**
 * Event types used throughout the game
 */
export enum EventType {
  // Combat Events
  ENEMY_KILLED = 'enemyKilled',
  PLAYER_DAMAGED = 'playerDamaged',
  AXE_THROWN = 'axeThrown',
  AXE_HIT = 'axeHit',
  
  // Pickup Events
  XP_COLLECTED = 'xpCollected',
  HEART_COLLECTED = 'heartCollected',
  PICKUP_SPAWNED = 'pickupSpawned',
  
  // Level Events
  LEVEL_UP = 'levelUp',
  SHOP_OPENED = 'shopOpened',
  SHOP_CLOSED = 'shopClosed',
  UPGRADE_SELECTED = 'upgradeSelected',
  
  // Game State Events
  GAME_STARTED = 'gameStarted',
  GAME_OVER = 'gameOver',
  GAME_PAUSED = 'gamePaused',
  GAME_RESUMED = 'gameResumed',
  
  // Performance Events
  PERFORMANCE_WARNING = 'performanceWarning',
  MEMORY_WARNING = 'memoryWarning',
  
  // Spawn Events
  ENEMY_SPAWNED = 'enemySpawned',
  WAVE_STARTED = 'waveStarted',
  WAVE_COMPLETED = 'waveCompleted'
}

/**
 * Event data interfaces for type safety
 */
export interface EnemyKilledEvent {
  enemyType: string;
  x: number;
  y: number;
  level: number;
  xpValue: number;
}

export interface PlayerDamagedEvent {
  damage: number;
  currentHealth: number;
  maxHealth: number;
  source: string;
}

export interface XpCollectedEvent {
  amount: number;
  totalXp: number;
  level: number;
}

export interface LevelUpEvent {
  newLevel: number;
  xpRequired: number;
  upgradesAvailable: string[];
}

export interface GameOverEvent {
  finalLevel: number;
  finalXp: number;
  enemiesKilled: number;
  timeSurvived: number;
}

/**
 * Event System - Central event bus for game communication
 * 
 * Features:
 * - Type-safe event emission and listening
 * - Automatic cleanup of one-time listeners
 * - Performance monitoring
 * - Debug logging in development
 */
export class EventSystem {
  private static listeners: Map<string, EventListener[]> = new Map();
  private static listenerIdCounter = 0;
  private static isDebugMode = false;

  /**
   * Subscribe to an event
   * @param eventType - The event type to listen for
   * @param callback - Function to call when event occurs
   * @param once - If true, listener is removed after first call
   * @returns Listener ID for unsubscribing
   */
  static on(eventType: EventType, callback: (data?: any) => void, once = false): string {
    const listenerId = `listener_${++this.listenerIdCounter}`;
    const listener: EventListener = {
      id: listenerId,
      eventType,
      callback,
      once
    };

    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(listener);

    if (this.isDebugMode) {
      console.log(`🎯 Event listener registered: ${eventType} (ID: ${listenerId})`);
    }

    return listenerId;
  }

  /**
   * Subscribe to an event once (auto-removes after first call)
   * @param eventType - The event type to listen for
   * @param callback - Function to call when event occurs
   * @returns Listener ID for unsubscribing
   */
  static once(eventType: EventType, callback: (data?: any) => void): string {
    return this.on(eventType, callback, true);
  }

  /**
   * Unsubscribe from an event
   * @param eventType - The event type
   * @param listenerId - The listener ID returned from on() or once()
   */
  static off(eventType: EventType, listenerId: string): boolean {
    const listeners = this.listeners.get(eventType);
    if (!listeners) return false;

    const initialLength = listeners.length;
    const filteredListeners = listeners.filter(listener => listener.id !== listenerId);
    
    if (filteredListeners.length !== initialLength) {
      if (filteredListeners.length === 0) {
        // Remove the event type entirely when no listeners remain
        this.listeners.delete(eventType);
      } else {
        this.listeners.set(eventType, filteredListeners);
      }
      
      if (this.isDebugMode) {
        console.log(`🗑️ Event listener removed: ${eventType} (ID: ${listenerId})`);
      }
      return true;
    }
    
    return false;
  }

  /**
   * Remove all listeners for an event type
   * @param eventType - The event type to clear
   */
  static clear(eventType: EventType): void {
    this.listeners.delete(eventType);
    
    if (this.isDebugMode) {
      console.log(`🧹 All listeners cleared for: ${eventType}`);
    }
  }

  /**
   * Remove all event listeners
   */
  static clearAll(): void {
    this.listeners.clear();
    
    if (this.isDebugMode) {
      console.log('🧹 All event listeners cleared');
    }
  }

  /**
   * Emit an event to all listeners
   * @param eventType - The event type to emit
   * @param data - Optional data to pass to listeners
   */
  static emit(eventType: EventType, data?: any): void {
    const listeners = this.listeners.get(eventType);
    if (!listeners || listeners.length === 0) return;

    if (this.isDebugMode) {
      console.log(`📡 Event emitted: ${eventType}`, data);
    }

    // Create a copy of listeners to avoid modification during iteration
    const listenersCopy = [...listeners];
    const toRemove: string[] = [];

    for (const listener of listenersCopy) {
      try {
        listener.callback(data);
        
        if (listener.once) {
          toRemove.push(listener.id);
        }
      } catch (error) {
        console.error(`Error in event listener ${listener.id} for ${eventType}:`, error);
      }
    }

    // Remove one-time listeners
    for (const listenerId of toRemove) {
      this.off(eventType, listenerId);
    }
  }

  /**
   * Get the number of listeners for an event type
   * @param eventType - The event type to check
   * @returns Number of active listeners
   */
  static getListenerCount(eventType: EventType): number {
    const listeners = this.listeners.get(eventType);
    return listeners ? listeners.length : 0;
  }

  /**
   * Get all active event types
   * @returns Array of event types with active listeners
   */
  static getActiveEventTypes(): EventType[] {
    return Array.from(this.listeners.keys()) as EventType[];
  }

  /**
   * Enable debug mode for detailed logging
   * @param enabled - Whether to enable debug mode
   */
  static setDebugMode(enabled: boolean): void {
    this.isDebugMode = enabled;
    console.log(`🔧 Event System debug mode: ${enabled ? 'ON' : 'OFF'}`);
  }

  /**
   * Get system statistics
   * @returns Object with listener counts and active event types
   */
  static getStats(): { totalListeners: number; activeEventTypes: number; eventTypes: EventType[] } {
    let totalListeners = 0;
    for (const listeners of this.listeners.values()) {
      totalListeners += listeners.length;
    }

    return {
      totalListeners,
      activeEventTypes: this.listeners.size,
      eventTypes: this.getActiveEventTypes()
    };
  }
} 