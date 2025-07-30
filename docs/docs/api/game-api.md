---
sidebar_position: 1
---

# Game API

The core game API provides functionality for game state management, game loop control, and basic game operations.

## BulletBuzzGame Class

The main game API facade that wraps the internal game systems.

### Constructor

```typescript
new BulletBuzzGame(config?: GameConfig)
```

**Parameters:**
- `config` (optional): Game configuration object

**Example:**
```typescript
import { BulletBuzzGame } from './src/BulletBuzzGame';

const game = new BulletBuzzGame({
  playerHp: 10,
  playerSpeed: 0.85,
  enemySpeed: 0.15,
  spawnInterval: 8.0
});
```

## Game State Management

### getGameState()

Returns the current game state.

```typescript
getGameState(): GameState
```

**Returns:** `GameState` object containing current game information

**Example:**
```typescript
const state = game.getGameState();
console.log(`Level: ${state.level}`);
console.log(`Enemies Killed: ${state.enemiesKilled}`);
console.log(`XP Collected: ${state.xpCollected}`);
```

### getMemory()

Returns memory usage information.

```typescript
getMemory(): MemoryUsage
```

**Returns:** `MemoryUsage` object with memory statistics

**Example:**
```typescript
const memory = game.getMemory();
console.log(`Memory Usage: ${memory.usage}%`);
console.log(`Objects: ${memory.objects}`);
```

## Game Control

### step(deltaTime)

Advances the game by the specified time delta.

```typescript
step(deltaTime: number): void
```

**Parameters:**
- `deltaTime`: Time in seconds to advance the game

**Example:**
```typescript
// Step game forward by 1/60th of a second (60 FPS)
game.step(1/60);

// Step game forward by 1 second
game.step(1.0);
```

### reset()

Resets the game to initial state.

```typescript
reset(): void
```

**Example:**
```typescript
game.reset();
console.log('Game has been reset');
```

## Shop System

### getShopOptions()

Returns available shop options for the current level.

```typescript
getShopOptions(): ShopOption[]
```

**Returns:** Array of shop options

**Example:**
```typescript
const options = game.getShopOptions();
options.forEach((option, index) => {
  console.log(`${index + 1}. ${option.name}: ${option.description}`);
});
```

### selectShopOption(index)

Selects a shop option by index.

```typescript
selectShopOption(index: number): void
```

**Parameters:**
- `index`: Zero-based index of the shop option to select

**Example:**
```typescript
// Select the first shop option
game.selectShopOption(0);
```

### isShopOpen()

Checks if the shop is currently open.

```typescript
isShopOpen(): boolean
```

**Returns:** `true` if shop is open, `false` otherwise

**Example:**
```typescript
if (game.isShopOpen()) {
  console.log('Shop is open - make a selection');
} else {
  console.log('Shop is closed');
}
```

## Testing Methods

### getEnemiesSpawned()

Returns the total number of enemies spawned.

```typescript
getEnemiesSpawned(): number
```

### getEnemiesKilled()

Returns the total number of enemies killed.

```typescript
getEnemiesKilled(): number
```

### getXpCollected()

Returns the total XP collected.

```typescript
getXpCollected(): number
```

### getLevel()

Returns the current player level.

```typescript
getLevel(): number
```

## Game State Interface

```typescript
interface GameState {
  // Player information
  playerHp: number;
  playerMaxHp: number;
  playerX: number;
  playerY: number;
  playerSpeed: number;
  pickupRange: number;
  attackRange: number;
  
  // Game progress
  level: number;
  xp: number;
  xpToNextLevel: number;
  enemiesKilled: number;
  enemiesSpawned: number;
  xpCollected: number;
  heartsCollected: number;
  
  // Game state
  gameTime: number;
  paused: boolean;
  gameOver: boolean;
  showShop: boolean;
  
  // Performance
  frameRate: number;
  memoryUsage: number;
}
```

## Memory Usage Interface

```typescript
interface MemoryUsage {
  usage: number;      // Memory usage percentage
  objects: number;    // Number of game objects
  arrays: number;     // Number of arrays
  warnings: string[]; // Memory warnings
}
```

## Shop Option Interface

```typescript
interface ShopOption {
  name: string;        // Option name
  description: string; // Option description
  cost: number;        // XP cost
  effect: string;      // Effect description
}
```

## Error Handling

The Game API includes comprehensive error handling:

```typescript
try {
  game.step(1/60);
} catch (error) {
  console.error('Game step failed:', error);
}

// Check for memory warnings
const memory = game.getMemory();
if (memory.warnings.length > 0) {
  console.warn('Memory warnings:', memory.warnings);
}
```

## Performance Considerations

- **Fixed Timestep**: The game uses a fixed timestep for consistent updates
- **Memory Management**: Automatic cleanup of temporary objects
- **Object Pooling**: Efficient memory usage for frequently created objects
- **Array Limits**: Prevents unbounded growth of game object arrays

## Examples

### Basic Game Loop

```typescript
const game = new BulletBuzzGame();
const targetFPS = 60;
const frameTime = 1 / targetFPS;

function gameLoop() {
  game.step(frameTime);
  
  const state = game.getGameState();
  if (state.gameOver) {
    console.log('Game Over!');
    return;
  }
  
  requestAnimationFrame(gameLoop);
}

gameLoop();
```

### Shop Interaction

```typescript
// Check if shop is open
if (game.isShopOpen()) {
  const options = game.getShopOptions();
  
  // Display options
  options.forEach((option, index) => {
    console.log(`${index + 1}. ${option.name}: ${option.description}`);
  });
  
  // Select first option
  game.selectShopOption(0);
}
```

### Performance Monitoring

```typescript
// Monitor game performance
setInterval(() => {
  const state = game.getGameState();
  const memory = game.getMemory();
  
  console.log(`FPS: ${state.frameRate}`);
  console.log(`Memory: ${memory.usage}%`);
  console.log(`Objects: ${memory.objects}`);
}, 1000);
``` 