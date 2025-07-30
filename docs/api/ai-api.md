# AI API

## Auto-Pathing System

The AI system handles intelligent movement and pathfinding for the player character.

### Features

- **Wall Avoidance**: Automatically avoids obstacles and boundaries
- **Target Tracking**: Moves towards enemies and pickups
- **Efficient Pathfinding**: Optimized movement algorithms
- **Dynamic Behavior**: Adapts to changing game conditions

### Configuration

```typescript
interface AIConfig {
  avoidanceDistance: number;
  attractionStrength: number;
  maxSpeed: number;
}
```

## Enemy AI

Enemies use simplified AI for movement and behavior patterns.

### Behavior Patterns

- **Chase Mode**: Enemies move towards the player
- **Wander Mode**: Random movement when no target
- **Aggressive Mode**: Increased speed and damage 