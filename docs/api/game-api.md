# Game API

## BulletBuzzGame Class

The main game class that handles the entire game loop and state management.

### Constructor

```typescript
new BulletBuzzGame(canvas: HTMLCanvasElement, options?: GameOptions)
```

### Methods

#### `start()`
Starts the game loop and begins gameplay.

#### `pause()`
Pauses the game loop.

#### `resume()`
Resumes the game loop.

#### `reset()`
Resets the game to initial state.

#### `update(deltaTime: number)`
Updates game state for the given time delta.

### Properties

- `player`: The player character instance
- `enemies`: Array of active enemies
- `pickups`: Array of active pickups
- `level`: Current game level
- `score`: Current score
- `gameState`: Current game state (playing, paused, gameOver)

## Game Options

```typescript
interface GameOptions {
  gameSpeed?: number;
  autoPath?: boolean;
  autoShop?: boolean;
}
```

## Events

The game emits various events that can be listened to:

- `levelUp`: Fired when player levels up
- `gameOver`: Fired when game ends
- `enemySpawned`: Fired when new enemy spawns
- `pickupCollected`: Fired when pickup is collected 