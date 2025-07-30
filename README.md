# BulletBuzz Game

A browser-based auto-battler game with sophisticated AI and headless simulation capabilities for balance testing.

## Core Components

### `bulletbuzz-core.js`
The core game logic extracted into a clean, reusable class. Features:

- **Advanced AI auto-pathing** with three-tier enemy response system
- **Smart wall avoidance** using attack range as padding
- **Strategic robot vacuum behavior** that seeks last killed enemy positions
- **Configurable flee, avoid, and attack ranges** for fine-tuned balance
- **Enemy spawning and movement** with configurable parameters
- **XP-based leveling system** (10 XP per level)
- **Heart drops for healing** with configurable drop rates
- **Auto-attacking with axes** that target nearby enemies
- **Configurable balance parameters** for easy testing

### `test-runner.js`
A Node.js simulation runner for testing game balance:

```bash
# Run basic simulation
node test-runner.js

# Test multiple configurations
node test-runner.js --test-configs
```

### `index-simplified.html`
The recommended browser game with:
- Visual rendering using HTML5 Canvas
- Interactive parameter sliders with localStorage persistence
- Real-time simulation controls
- Game state output and sharing
- Advanced AI visualization (flee range, attack range, pickup range)

## Game Mechanics

### Advanced AI System

#### Three-Tier Enemy Response:
1. **🏃‍♂️ Flee Range (25 units)**: Emergency fleeing when enemies are very close
2. **⚔️ Attack Range (86 units)**: Seeks enemies for combat when in optimal range
3. **🤖 Robot Vacuum Mode**: Strategic wandering when no enemies in range

#### Smart Wall Avoidance:
- **Attack range padding**: Player stays 86 units from walls during auto-pathing
- **Active wall avoidance**: Moves away from walls when too close (43 units)
- **Edge access**: Can reach XP at edges while maintaining strategic positioning

#### Strategic Movement:
- **Last killed enemy seeking**: Moves toward last enemy position when no enemies nearby
- **Resource collection**: Prioritizes XP and hearts when health is low
- **Combat positioning**: Maintains optimal distance for axe throwing

### Player
- **Auto-pathing**: Intelligent movement with three-tier enemy response
- **Attack range**: 86.25 units (auto-fires axes at enemies)
- **Pickup range**: 12 units (reduced for more precise collection)
- **Flee range**: 25 units (emergency escape when enemies too close)
- **Health**: Configurable starting HP (default: 12)
- **Wall avoidance**: Uses attack range as padding (86 units from edges)

### Enemies
- **Movement**: Chase the player with configurable speed
- **Spawning**: Configurable intervals and group sizes
- **Drops**: XP orbs when killed
- **Attack**: Damage player on contact

### Leveling
- **XP requirement**: 10 × current level
- **Progression**: Each XP orb = 1 point
- **Shop**: Appears every level (auto-shopping enabled by default)

### Balance Parameters

| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| `startHp` | 12 | 5-20 | Starting player health |
| `pickupRange` | 12 | 5-25 | XP/heart pickup distance (reduced) |
| `playerSpeed` | 0.85 | 0.5-1.5 | Player movement speed |
| `enemySpeed` | 0.15 | 0.05-0.5 | Enemy movement speed |
| `spawnInterval` | 8000 | 2000-15000 | Base spawn interval (ms) |
| `heartDropRate` | 0.20 | 0.05-0.50 | Heart drop probability |
| `avoidDistance` | 80 | 50-200 | Enemy avoidance distance |
| `avoidStrength` | 0.8 | 0.5-5.0 | Enemy avoidance force |
| `fleeRange` | 25 | 15-50 | Emergency flee distance |
| `fleeStrength` | 1.5 | 1.0-3.0 | Flee movement force |
| `singleEnemyLevel` | 6 | 1-10 | Level where groups start |
| `minSpawnInterval` | 4500 | 2000-8000 | Minimum spawn interval (ms) |
| `levelScaling` | 15 | 5-30 | Enemy spawn rate scaling |
| `earlyLevelScaling` | 2 | 1-10 | Early level spawn scaling |
| `attackRange` | 86.25 | 50-200 | Player attack range |
| `projectileCount` | 1 | 1-5 | Number of axes thrown |
| `projectileSpeed` | 4 | 2-10 | Axe projectile speed |
| `attackSpeed` | 1.0 | 0.5-3.0 | Attacks per second |

## AI Behavior Details

### Flee Mode (High Priority)
- **Trigger**: Enemies within 25 units (yellow circle)
- **Behavior**: Strong movement away from enemies
- **Strength**: 1.5x player speed

### Combat Mode (Medium Priority)
- **Trigger**: Enemies between 25-86 units (red circle)
- **Behavior**: Seeks nearest enemy for combat
- **Strength**: 30% of player speed

### Robot Vacuum Mode (Low Priority)
- **Trigger**: No enemies in combat range
- **Behavior**: Seeks last killed enemy position, then random wandering
- **Strength**: 20-30% of player speed

### Wall Avoidance
- **Trigger**: Within 43 units of walls (50% of attack range)
- **Behavior**: Active movement away from walls
- **Strength**: 50% of player speed

## Simulation Results

The current balance shows:
- **0% success rate** reaching level 5 in 5 minutes
- **Average level**: 4.0 (consistently times out at level 4)
- **Progression speed**: Too slow for target level

### Level Progression Times
- **Level 1→2**: ~1:30-1:50 (good early progression)
- **Level 2→3**: ~2:45-3:20 (slowing down)
- **Level 3→4**: ~4:15-4:30 (getting much slower)
- **Level 4→5**: Never reached (timed out)

## Usage Examples

### Basic Simulation
```javascript
const BulletBuzzGame = require('./bulletbuzz-core.js');

const game = new BulletBuzzGame({
  startHp: 12,
  pickupRange: 12,
  enemySpeed: 0.15,
  fleeRange: 25,
  attackRange: 86.25
});

// Run until game over or level 5
while (!game.isGameOver() && !game.hasReachedLevel(5)) {
  game.step();
}

console.log(game.getGameState());
```

### Custom Configuration Testing
```javascript
const GameSimulator = require('./test-runner.js');

const simulator = new GameSimulator();
simulator.runSimulation({
  runs: 10,
  targetLevel: 5,
  maxTime: 300,
  gameConfig: {
    startHp: 15,
    pickupRange: 12,
    enemySpeed: 0.1,
    spawnInterval: 6000,
    fleeRange: 25,
    attackRange: 86.25
  }
});
```

## Files

- `index.html` - Full browser game with UI (legacy - contains duplicated logic)
- `index-simplified.html` - Browser game using core game class (recommended)
- `bulletbuzz-core.js` - Core game logic with advanced AI (shareable)
- `test-runner.js` - Node.js simulation runner
- `test-game.js` - Original headless version (legacy)

## Development

The game is designed for easy balance testing and iteration. The core logic is separated from the visual components, making it perfect for:

- **Automated testing** of different configurations
- **Balance analysis** through simulation data
- **Parameter optimization** for target difficulty
- **Sharing core logic** without browser dependencies
- **AI behavior testing** with sophisticated movement patterns

### Recent Improvements

- **Advanced AI System**: Three-tier enemy response with flee, combat, and robot vacuum modes
- **Smart Wall Avoidance**: Uses attack range as padding with active wall avoidance
- **Strategic Movement**: Seeks last killed enemy positions for better positioning
- **Reduced Pickup Range**: More precise resource collection (12 units)
- **Configurable Flee System**: Emergency escape with configurable range and strength
- **Visual Range Indicators**: Yellow (flee), red (attack), cyan (pickup) circles
- **Maximum Speed Default**: Game starts at 20x speed for faster testing
