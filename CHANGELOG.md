# Changelog

All notable changes to BulletBuzz will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Enhanced error detection in Playwright tests
- Console error logging and network failure detection
- Content assertions for automated testing
- Real-time error reporting during screenshot tests

### Changed
- Updated game genre from "Auto-Battler" to "Bullet Heaven" (completed)
- Corrected documentation to reflect Brotato/Vampire Survivors inspiration
- Clarified that player AI is for playtesting, not core gameplay

## [1.0.0] - 2025-07-30

### Added
- **Complete TypeScript Migration**: Full migration with strict type checking
- **GitHub Pages Deployment**: Live game at https://tjsingleton.github.io/bulletbuzz/
- **Performance Optimization**: Fixed timestep game loop for consistent physics
- **Memory Management**: Lifetime tracking and comprehensive cleanup
- **Testing Infrastructure**: 28 comprehensive unit tests with Jest
- **Debug Tools**: Comprehensive browser console debugging via `debugGame.*` commands
- **Documentation**: Professional README and comprehensive code comments
- **CI/CD Pipeline**: Automated deployment on push via GitHub Actions
- **Modular Architecture**: Clean separation of concerns with focused components
- **Enhanced UI**: Professional shop and game over screens
- **Auto-Shop System**: Automatic upgrade selection between levels
- **Pickup Attraction**: XP and heart attraction mechanics within pickup range
- **URL Parameters**: Game speed control via URL (e.g., `?speed=10`)
- **Comprehensive Testing**: Jest test suite with 100% coverage of core systems
- **MkDocs Documentation Site**: Professional documentation with Material theme
- **TypeDoc API Documentation**: Auto-generated from TypeScript code
- **Enhanced Screenshot Testing**: Playwright-based automated testing
- **Error Detection**: Real-time console, network, and page error monitoring

### Changed
- **Architecture**: Refactored from 547-line monolithic class to modular components
- **Build System**: Modern TypeScript compilation with development server
- **Game Loop**: Implemented fixed timestep for consistent simulation
- **UI Framework**: Professional modals and enhanced visual design
- **Testing**: From manual testing to comprehensive automated testing
- **Deployment**: From manual deployment to automated CI/CD pipeline
- **Documentation**: From basic README to comprehensive documentation site

### Fixed
- **Code Duplication**: Removed massive duplication between `index.html` and `BulletBuzzGame.ts`
- **Performance Issues**: Variable game loop timing causing unpredictable behavior
- **Memory Leaks**: Arrays growing indefinitely without cleanup
- **Type Safety**: Runtime errors due to lack of type checking
- **Deployment Issues**: Manual deployment process
- **Navigation Issues**: Documentation site navigation problems
- **Path Issues**: Game files not being served correctly from GitHub Pages

### Technical Details

#### Architecture Improvements
- **Modular Design**: Separated concerns into focused components
  ```
  src/
  ├── core/
  │   ├── Game.ts ✅
  │   ├── Player.ts ✅
  │   ├── Enemy.ts ✅
  │   ├── XpDrop.ts ✅
  │   ├── HeartDrop.ts ✅
  │   └── Axe.ts ✅
  ├── systems/
  │   ├── SpawnSystem.ts ✅
  │   ├── CollisionSystem.ts ✅
  │   └── LevelSystem.ts ✅
  └── BulletBuzzGame.ts ✅ (Clean API)
  ```

#### Testing Infrastructure
- **Unit Tests**: 28 comprehensive tests covering all systems
- **Integration Tests**: End-to-end game flow validation
- **Automated Testing**: CI/CD pipeline with automated balance testing
- **Screenshot Testing**: Playwright-based visual regression testing
- **Error Detection**: Real-time monitoring of console, network, and page errors

#### Performance Optimizations
- **Fixed Timestep**: Consistent 60 FPS game loop with accumulator pattern
- **Memory Management**: Object lifetime tracking and automatic cleanup
- **Array Limits**: Maximum sizes to prevent unbounded growth
- **URL Speed Control**: Up to 20x speed for testing via URL parameters

#### Development Tools
- **TypeScript**: Strict type checking with comprehensive interfaces
- **ESLint + Prettier**: Code quality and formatting
- **Jest**: Unit testing framework with coverage reporting
- **Playwright**: Browser automation for testing and screenshots
- **MkDocs**: Professional documentation site generation
- **TypeDoc**: Auto-generated API documentation from TypeScript

#### Deployment Pipeline
- **GitHub Actions**: Automated CI/CD pipeline
- **GitHub Pages**: Live deployment of both game and documentation
- **Site Structure**: Clean separation of game (`/game/`) and documentation (`/`)
- **Error Monitoring**: Real-time error detection and reporting

## [Pre-1.0.0] - Initial Development

### Added
- Basic game mechanics (player movement, enemy spawning, combat)
- Simple UI with game canvas and basic controls
- Auto-pathing AI for playtesting
- Basic shop system between levels
- XP and level progression system
- Enemy AI with chase behavior
- Collision detection system
- Basic game over screen

---

## Release Notes

### Version 1.0.0
This is the first major release of BulletBuzz, representing a complete transformation from prototype to production-ready game. The focus was on establishing a solid foundation with proper architecture, testing, and deployment infrastructure.

**Key Achievements:**
- ✅ Complete TypeScript migration with strict type checking
- ✅ Modular architecture with clean separation of concerns
- ✅ Comprehensive testing infrastructure (28 unit tests)
- ✅ Professional documentation site with auto-generated API docs
- ✅ Automated deployment pipeline via GitHub Actions
- ✅ Enhanced UI with professional modals and visual design
- ✅ Performance optimizations with fixed timestep game loop
- ✅ Memory management with lifetime tracking and cleanup
- ✅ Real-time error detection and monitoring
- ✅ Live deployment at https://tjsingleton.github.io/bulletbuzz/

**Next Steps:**
The foundation is now solid and ready for advanced gameplay features, including:
- Combat system overhaul with multiple weapon types
- Enemy variety with different AI patterns
- Power-up system with skill trees
- Level design with obstacles and terrain
- Advanced AI with behavior trees and pathfinding # Trigger deployment for asset reorganization
