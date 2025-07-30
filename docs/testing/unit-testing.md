# Unit Testing

BulletBuzz includes comprehensive unit tests covering all major game systems.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Structure

Tests are organized by system:

- `BulletBuzzGame.test.ts`: Main game class tests
- `core/Player.test.ts`: Player character tests
- `core/Enemy.test.ts`: Enemy AI tests
- `core/Axe.test.ts`: Combat system tests
- `systems/CollisionSystem.test.ts`: Collision detection tests
- `systems/LevelSystem.test.ts`: Level progression tests
- `systems/SpawnSystem.test.ts`: Enemy spawning tests

## Test Coverage

The test suite covers:

- ✅ Game initialization and state management
- ✅ Player movement and controls
- ✅ Enemy AI and pathfinding
- ✅ Combat mechanics and collision detection
- ✅ Pickup collection and attraction
- ✅ Level progression and shop system
- ✅ Performance monitoring
- ✅ Memory management

## Example Test

```typescript
describe('Player', () => {
  it('should move towards target position', () => {
    const player = new Player(100, 100);
    player.moveTowards(200, 200);
    
    expect(player.x).toBeGreaterThan(100);
    expect(player.y).toBeGreaterThan(100);
  });
});
``` 