---
sidebar_position: 5
---

# Configuration API

Documentation for game configuration and balance settings.

## Overview

The Configuration API provides control over game balance, difficulty, and performance settings.

## Game Configuration

### GameConfig Interface

```typescript
interface GameConfig {
  // Player settings
  playerHp?: number;
  playerSpeed?: number;
  pickupRange?: number;
  attackRange?: number;
  
  // Enemy settings
  enemySpeed?: number;
  spawnInterval?: number;
  minSpawnInterval?: number;
  
  // Auto-pathing settings
  avoidanceDistance?: number;
  avoidanceStrength?: number;
  
  // Difficulty settings
  difficultyScaling?: number;
  maxEnemies?: number;
}
```

## Default Configuration

```typescript
const defaultConfig = {
  // Player settings
  playerHp: 10,
  playerSpeed: 0.85,
  pickupRange: 25,
  attackRange: 150,
  
  // Enemy settings
  enemySpeed: 0.15,
  spawnInterval: 8.0,
  minSpawnInterval: 2.0,
  
  // Auto-pathing settings
  avoidanceDistance: 120,
  avoidanceStrength: 2.0,
  
  // Difficulty settings
  difficultyScaling: 0.15,
  maxEnemies: 50
};
```

## Configuration Examples

### Easy Mode

```typescript
const easyConfig = {
  playerHp: 15,
  playerSpeed: 1.0,
  enemySpeed: 0.1,
  spawnInterval: 10.0,
  difficultyScaling: 0.1
};
```

### Hard Mode

```typescript
const hardConfig = {
  playerHp: 5,
  playerSpeed: 0.7,
  enemySpeed: 0.25,
  spawnInterval: 5.0,
  difficultyScaling: 0.25
};
```

### Speed Testing

```typescript
const speedTestConfig = {
  spawnInterval: 1.0,
  minSpawnInterval: 0.5,
  difficultyScaling: 0.5
};
```

## Balance Parameters

### Player Settings

- **playerHp**: Starting health points
- **playerSpeed**: Movement speed multiplier
- **pickupRange**: Range for collecting pickups
- **attackRange**: Range for attacking enemies

### Enemy Settings

- **enemySpeed**: Movement speed of enemies
- **spawnInterval**: Time between enemy spawns
- **minSpawnInterval**: Minimum spawn interval

### AI Settings

- **avoidanceDistance**: Distance to avoid walls
- **avoidanceStrength**: Strength of wall avoidance

### Difficulty Settings

- **difficultyScaling**: How quickly difficulty increases
- **maxEnemies**: Maximum number of enemies

## URL Parameters

### Game Speed

```javascript
// Set game speed via URL
const urlParams = new URLSearchParams(window.location.search);
const speed = urlParams.get('speed') || 1.0;
```

### Development Mode

```javascript
// Enable development features
const devMode = urlParams.get('dev') === 'true';
```

## Performance Configuration

### Memory Limits

```typescript
const performanceConfig = {
  maxObjects: 1000,
  maxArrays: 100,
  memoryWarningThreshold: 0.9
};
```

### Frame Rate Settings

```typescript
const frameRateConfig = {
  targetFPS: 60,
  minFPS: 30,
  maxFPS: 120
};
```

## Configuration Validation

### Validation Rules

```typescript
function validateConfig(config: GameConfig): boolean {
  // Validate player settings
  if (config.playerHp && config.playerHp <= 0) return false;
  if (config.playerSpeed && config.playerSpeed <= 0) return false;
  
  // Validate enemy settings
  if (config.enemySpeed && config.enemySpeed <= 0) return false;
  if (config.spawnInterval && config.spawnInterval <= 0) return false;
  
  return true;
}
```

### Error Handling

```typescript
try {
  const game = new BulletBuzzGame(config);
} catch (error) {
  console.error('Invalid configuration:', error);
  // Use default configuration
  const game = new BulletBuzzGame();
}
```

## Best Practices

### Configuration Management

- **Validation**: Always validate configuration values
- **Defaults**: Provide sensible default values
- **Documentation**: Document all configuration options
- **Testing**: Test different configurations

### Balance Tuning

- **Incremental Changes**: Make small, incremental changes
- **Testing**: Test changes thoroughly
- **Metrics**: Track performance metrics
- **Feedback**: Gather user feedback

### Performance Optimization

- **Memory Monitoring**: Monitor memory usage
- **Frame Rate**: Maintain consistent frame rate
- **Load Testing**: Test with maximum load
- **Optimization**: Optimize based on metrics 