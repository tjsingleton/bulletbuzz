/**
 * Event System Tests
 * 
 * Comprehensive test suite for the Event System covering:
 * - Event registration and unregistration
 * - Event emission and listener execution
 * - One-time listeners
 * - Error handling
 * - Performance monitoring
 * - Debug mode functionality
 */

import { EventSystem, EventType } from '../../src/events/EventSystem';

describe('EventSystem', () => {
  beforeEach(() => {
    // Clear all listeners before each test
    EventSystem.clearAll();
    EventSystem.setDebugMode(false);
  });

  describe('Event Registration', () => {
    it('should register event listeners', () => {
      const callback = jest.fn();
      const listenerId = EventSystem.on(EventType.ENEMY_KILLED, callback);

      expect(listenerId).toBeDefined();
      expect(EventSystem.getListenerCount(EventType.ENEMY_KILLED)).toBe(1);
    });

    it('should register multiple listeners for same event', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      EventSystem.on(EventType.ENEMY_KILLED, callback1);
      EventSystem.on(EventType.ENEMY_KILLED, callback2);

      expect(EventSystem.getListenerCount(EventType.ENEMY_KILLED)).toBe(2);
    });

    it('should return unique listener IDs', () => {
      const callback = jest.fn();
      const id1 = EventSystem.on(EventType.ENEMY_KILLED, callback);
      const id2 = EventSystem.on(EventType.PLAYER_DAMAGED, callback);

      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^listener_\d+$/);
      expect(id2).toMatch(/^listener_\d+$/);
    });

    it('should handle one-time listeners', () => {
      const callback = jest.fn();
      const listenerId = EventSystem.once(EventType.ENEMY_KILLED, callback);

      expect(listenerId).toBeDefined();
      expect(EventSystem.getListenerCount(EventType.ENEMY_KILLED)).toBe(1);
    });
  });

  describe('Event Emission', () => {
    it('should emit events to registered listeners', () => {
      const callback = jest.fn();
      const testData = { enemyType: 'bee', x: 100, y: 200 };

      EventSystem.on(EventType.ENEMY_KILLED, callback);
      EventSystem.emit(EventType.ENEMY_KILLED, testData);

      expect(callback).toHaveBeenCalledWith(testData);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should emit events to multiple listeners', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      const testData = { enemyType: 'wasp' };

      EventSystem.on(EventType.ENEMY_KILLED, callback1);
      EventSystem.on(EventType.ENEMY_KILLED, callback2);
      EventSystem.emit(EventType.ENEMY_KILLED, testData);

      expect(callback1).toHaveBeenCalledWith(testData);
      expect(callback2).toHaveBeenCalledWith(testData);
    });

    it('should handle events with no data', () => {
      const callback = jest.fn();

      EventSystem.on(EventType.GAME_STARTED, callback);
      EventSystem.emit(EventType.GAME_STARTED);

      expect(callback).toHaveBeenCalledWith(undefined);
    });

    it('should not emit to unregistered listeners', () => {
      const callback = jest.fn();

      EventSystem.emit(EventType.ENEMY_KILLED, { enemyType: 'bee' });

      expect(callback).not.toHaveBeenCalled();
    });

    it('should handle one-time listeners correctly', () => {
      const callback = jest.fn();

      EventSystem.once(EventType.ENEMY_KILLED, callback);
      
      // First emission
      EventSystem.emit(EventType.ENEMY_KILLED, { enemyType: 'bee' });
      expect(callback).toHaveBeenCalledTimes(1);
      expect(EventSystem.getListenerCount(EventType.ENEMY_KILLED)).toBe(0);

      // Second emission (should not trigger callback)
      EventSystem.emit(EventType.ENEMY_KILLED, { enemyType: 'wasp' });
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('Event Unregistration', () => {
    it('should unregister specific listeners', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      const id1 = EventSystem.on(EventType.ENEMY_KILLED, callback1);
      EventSystem.on(EventType.ENEMY_KILLED, callback2);

      expect(EventSystem.getListenerCount(EventType.ENEMY_KILLED)).toBe(2);

      EventSystem.off(EventType.ENEMY_KILLED, id1);

      expect(EventSystem.getListenerCount(EventType.ENEMY_KILLED)).toBe(1);

      EventSystem.emit(EventType.ENEMY_KILLED, { enemyType: 'bee' });

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });

    it('should return false when unregistering non-existent listener', () => {
      const result = EventSystem.off(EventType.ENEMY_KILLED, 'non-existent-id');
      expect(result).toBe(false);
    });

    it('should clear all listeners for an event type', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      EventSystem.on(EventType.ENEMY_KILLED, callback1);
      EventSystem.on(EventType.PLAYER_DAMAGED, callback2);

      EventSystem.clear(EventType.ENEMY_KILLED);

      expect(EventSystem.getListenerCount(EventType.ENEMY_KILLED)).toBe(0);
      expect(EventSystem.getListenerCount(EventType.PLAYER_DAMAGED)).toBe(1);
    });

    it('should clear all listeners', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      EventSystem.on(EventType.ENEMY_KILLED, callback1);
      EventSystem.on(EventType.PLAYER_DAMAGED, callback2);

      EventSystem.clearAll();

      expect(EventSystem.getListenerCount(EventType.ENEMY_KILLED)).toBe(0);
      expect(EventSystem.getListenerCount(EventType.PLAYER_DAMAGED)).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle errors in event listeners gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const callback = jest.fn().mockImplementation(() => {
        throw new Error('Test error');
      });

      EventSystem.on(EventType.ENEMY_KILLED, callback);
      EventSystem.emit(EventType.ENEMY_KILLED, { enemyType: 'bee' });

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error in event listener'),
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    it('should continue processing other listeners when one fails', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const failingCallback = jest.fn().mockImplementation(() => {
        throw new Error('Test error');
      });
      const workingCallback = jest.fn();

      EventSystem.on(EventType.ENEMY_KILLED, failingCallback);
      EventSystem.on(EventType.ENEMY_KILLED, workingCallback);
      EventSystem.emit(EventType.ENEMY_KILLED, { enemyType: 'bee' });

      expect(workingCallback).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('Debug Mode', () => {
    it('should enable debug mode', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      EventSystem.setDebugMode(true);
      EventSystem.on(EventType.ENEMY_KILLED, jest.fn());

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Event listener registered')
      );

      consoleSpy.mockRestore();
    });

    it('should log event emissions in debug mode', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      EventSystem.setDebugMode(true);
      EventSystem.on(EventType.ENEMY_KILLED, jest.fn());
      EventSystem.emit(EventType.ENEMY_KILLED, { enemyType: 'bee' });

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Event emitted'),
        { enemyType: 'bee' }
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Statistics and Monitoring', () => {
    it('should return correct listener counts', () => {
      expect(EventSystem.getListenerCount(EventType.ENEMY_KILLED)).toBe(0);

      EventSystem.on(EventType.ENEMY_KILLED, jest.fn());
      expect(EventSystem.getListenerCount(EventType.ENEMY_KILLED)).toBe(1);

      EventSystem.on(EventType.ENEMY_KILLED, jest.fn());
      expect(EventSystem.getListenerCount(EventType.ENEMY_KILLED)).toBe(2);
    });

    it('should return active event types', () => {
      expect(EventSystem.getActiveEventTypes()).toEqual([]);

      EventSystem.on(EventType.ENEMY_KILLED, jest.fn());
      EventSystem.on(EventType.PLAYER_DAMAGED, jest.fn());

      const activeTypes = EventSystem.getActiveEventTypes();
      expect(activeTypes).toContain(EventType.ENEMY_KILLED);
      expect(activeTypes).toContain(EventType.PLAYER_DAMAGED);
    });

    it('should return system statistics', () => {
      EventSystem.on(EventType.ENEMY_KILLED, jest.fn());
      EventSystem.on(EventType.ENEMY_KILLED, jest.fn());
      EventSystem.on(EventType.PLAYER_DAMAGED, jest.fn());

      const stats = EventSystem.getStats();

      expect(stats.totalListeners).toBe(3);
      expect(stats.activeEventTypes).toBe(2);
      expect(stats.eventTypes).toContain(EventType.ENEMY_KILLED);
      expect(stats.eventTypes).toContain(EventType.PLAYER_DAMAGED);
    });
  });

  describe('Performance and Memory', () => {
    it('should handle large numbers of listeners efficiently', () => {
      const callbacks = Array.from({ length: 100 }, () => jest.fn());

      // Register 100 listeners
      callbacks.forEach(callback => {
        EventSystem.on(EventType.ENEMY_KILLED, callback);
      });

      expect(EventSystem.getListenerCount(EventType.ENEMY_KILLED)).toBe(100);

      // Emit event to all listeners
      EventSystem.emit(EventType.ENEMY_KILLED, { enemyType: 'bee' });

      callbacks.forEach(callback => {
        expect(callback).toHaveBeenCalledWith({ enemyType: 'bee' });
      });
    });

    it('should not leak memory when removing listeners', () => {
      const callback = jest.fn();
      const listenerId = EventSystem.on(EventType.ENEMY_KILLED, callback);

      expect(EventSystem.getListenerCount(EventType.ENEMY_KILLED)).toBe(1);

      EventSystem.off(EventType.ENEMY_KILLED, listenerId);

      expect(EventSystem.getListenerCount(EventType.ENEMY_KILLED)).toBe(0);
      // The event type should be removed from active types when no listeners remain
      expect(EventSystem.getActiveEventTypes()).toEqual([]);
    });
  });

  describe('Event Type Safety', () => {
    it('should only accept valid event types', () => {
      // This test ensures TypeScript compilation works correctly
      const callback = jest.fn();

      // These should compile without errors
      EventSystem.on(EventType.ENEMY_KILLED, callback);
      EventSystem.on(EventType.PLAYER_DAMAGED, callback);
      EventSystem.on(EventType.LEVEL_UP, callback);

      expect(EventSystem.getListenerCount(EventType.ENEMY_KILLED)).toBe(1);
      expect(EventSystem.getListenerCount(EventType.PLAYER_DAMAGED)).toBe(1);
      expect(EventSystem.getListenerCount(EventType.LEVEL_UP)).toBe(1);
    });
  });
}); 