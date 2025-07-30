---
sidebar_position: 2
---

# AI API

Documentation for the AI system and auto-pathing functionality.

## Overview

The AI API provides controls for the game's auto-pathing and AI behavior systems.

## Auto-Pathing Controls

### setAutoPathing(enabled)

Enables or disables auto-pathing for the player.

```typescript
setAutoPathing(enabled: boolean): void
```

### getAutoPathing()

Returns the current auto-pathing state.

```typescript
getAutoPathing(): boolean
```

## AI Configuration

### AI Settings

The AI system includes several configurable parameters:

- **Avoidance Distance**: How far the AI tries to stay from walls
- **Avoidance Strength**: How strongly the AI avoids obstacles
- **Target Selection**: How the AI chooses targets
- **Movement Patterns**: Different movement behaviors

## Examples

```typescript
// Enable auto-pathing
game.setAutoPathing(true);

// Check if auto-pathing is enabled
const autoPathing = game.getAutoPathing();
console.log('Auto-pathing enabled:', autoPathing);
```

## Configuration

AI behavior can be configured through the game configuration:

```typescript
const game = new BulletBuzzGame({
  avoidanceDistance: 120,
  avoidanceStrength: 2.0,
  // ... other AI settings
});
```

## Advanced Features

### Robot Vacuum Mode

The AI includes a "robot vacuum" mode that efficiently collects pickups:

- **Pathfinding**: AI finds optimal paths to pickups
- **Priority System**: Prioritizes XP over hearts
- **Efficiency**: Minimizes travel distance

### Wall Avoidance

The AI intelligently avoids walls and obstacles:

- **Collision Detection**: Detects potential collisions
- **Path Correction**: Adjusts path to avoid obstacles
- **Smooth Movement**: Maintains smooth movement patterns

## Performance Considerations

- **Pathfinding Efficiency**: AI uses optimized pathfinding algorithms
- **Memory Usage**: AI state is managed efficiently
- **Update Frequency**: AI updates are optimized for performance 