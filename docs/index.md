# BulletBuzz

<img src="logo.png" alt="BulletBuzz Logo" width="100" style="max-width: 100px; height: auto;">

<!-- Version: 750b788 -->

## 🚀 Quick Start

**🎮 [Play BulletBuzz Game](https://tjsingleton.github.io/bulletbuzz/game/)**

**📖 [View Documentation](https://tjsingleton.github.io/bulletbuzz/)**

**🎮 Development Mode**: Add `?speed=10` to the URL for 10x game speed!

## 🎯 What is BulletBuzz?

BulletBuzz is a bullet heaven game inspired by Brotato and Vampire Survivors, where you survive waves of enemies in an endless arena. The game features:

- **🧠 Advanced AI**: Intelligent auto-pathing with wall avoidance and smart targeting
- **⚔️ Bullet Heaven**: Survive waves of enemies in an endless arena
- **📱 Mobile Controls**: Virtual joystick and touch controls for mobile devices
- **🎨 Modern UI**: Professional shop modals and detailed game over screens
- **🧪 Testing**: Comprehensive unit tests, integration tests, and automated screenshot testing with error detection

## 🏗️ Architecture

### Technology Stack

- **TypeScript**: Type-safe game development
- **HTML5 Canvas**: Game rendering
- **ES Modules**: Modern JavaScript modules
- **Node.js**: Headless testing environment
- **Jest**: Unit testing framework
- **Playwright**: Automated browser testing and screenshots
- **MkDocs**: Professional documentation site
- **TypeDoc**: Auto-generated API documentation
- **Mermaid**: Architecture diagram rendering

### Core Systems

- **Game Loop**: Fixed timestep implementation for consistent updates
- **AI System**: Auto-pathing with wall avoidance and target tracking
- **Combat System**: Automatic axe throwing and collision detection
- **Pickup System**: XP and heart collection with attraction mechanics
- **Level System**: XP progression and shop management
- **Spawn System**: Dynamic enemy and pickup generation

### System Architecture

```mermaid
graph TB
    subgraph "Game Engine"
        Game[Game.ts<br/>Main Game Loop]
        Player[Player.ts<br/>Player Entity]
        Enemy[Enemy.ts<br/>Enemy Entities]
        Axe[Axe.ts<br/>Weapon System]
        HeartDrop[HeartDrop.ts<br/>Health Pickups]
        XpDrop[XpDrop.ts<br/>XP Pickups]
    end
    
    subgraph "Systems"
        CollisionSystem[CollisionSystem.ts<br/>Collision Detection]
        LevelSystem[LevelSystem.ts<br/>Level Management]
        SpawnSystem[SpawnSystem.ts<br/>Enemy Spawning]
    end
    
    subgraph "UI & Rendering"
        GameUI[game-ui.ts<br/>User Interface]
        Canvas[HTML5 Canvas<br/>Rendering]
    end
    
    subgraph "Types & Interfaces"
        Types[types.ts<br/>Type Definitions]
    end
    
    %% Core relationships
    Game --> Player
    Game --> Enemy
    Game --> Axe
    Game --> HeartDrop
    Game --> XpDrop
    
    %% System relationships
    Game --> CollisionSystem
    Game --> LevelSystem
    Game --> SpawnSystem
    
    %% UI relationships
    Game --> GameUI
    GameUI --> Canvas
    
    %% Type relationships
    Game --> Types
    Player --> Types
    Enemy --> Types
    Axe --> Types
    HeartDrop --> Types
    XpDrop --> Types
    CollisionSystem --> Types
    LevelSystem --> Types
    SpawnSystem --> Types
    
    %% System interactions
    CollisionSystem --> Player
    CollisionSystem --> Enemy
    CollisionSystem --> Axe
    CollisionSystem --> HeartDrop
    CollisionSystem --> XpDrop
    
    SpawnSystem --> Enemy
    LevelSystem --> SpawnSystem
    
    %% Styling
    classDef coreClass fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef systemClass fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef uiClass fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef typeClass fill:#fff3e0,stroke:#e65100,stroke-width:2px
    
    class Game,Player,Enemy,Axe,HeartDrop,XpDrop coreClass
    class CollisionSystem,LevelSystem,SpawnSystem systemClass
    class GameUI,Canvas uiClass
    class Types typeClass
```

## 🎮 Game Features

### 🧠 Advanced AI

- **Auto-Pathing**: Intelligent movement with wall avoidance and target tracking
- **Combat AI**: Smart targeting within attack range with automatic axe throwing
- **Pickup Attraction**: XP orbs and hearts attract to player within pickup range
- **Robot Vacuum Mode**: Efficient pickup collection with pathfinding to drops

### ⚔️ Gameplay Mechanics

- **Bullet Heaven**: Survive waves of enemies in an endless arena
- **XP System**: Level up to unlock new abilities with accurate progress tracking
- **Pickup System**: Collect hearts and XP drops with attraction mechanics
- **Shop System**: Choose upgrades between levels with auto-shop option
- **Difficulty Scaling**: Progressive challenge increase with dynamic spawn rates

### 🎨 Enhanced UI

- **Professional Shop Modal**: Button-like options with sequential numbering
- **Detailed Game Over Screen**: Comprehensive statistics with skull emoji
- **Real-time Stats**: Live player and enemy statistics
- **Range Visualization**: Attack and pickup range circles
- **XP Progress Bar**: Visual progress tracking

## 📊 Game Balance

### Current Settings

- **Player**: 10 HP, 0.85 speed, 25 pickup range, 150 attack range
- **Enemies**: 0.15 speed, 8s spawn interval
- **Auto-Pathing**: 120 avoidance distance, 2.0 strength
- **Difficulty**: Single enemy until level 6, 15% scaling
- **Shop**: Appears after every level with 3 random options

---

**Made with ❤️ by @tjsingleton** 