import { BulletBuzzGame } from './dist/BulletBuzzGame.js';

class GameSimulator {
  constructor() {
    this.results = [];
  }
  
  runSimulation(config = {}) {
    const {
      runs = 10,
      targetLevel = 5,
      maxTime = 300, // 5 minutes
      gameConfig = {}
    } = config;
    
    console.log(`Starting simulation: ${runs} runs, target level ${targetLevel}, max time ${maxTime}s`);
    
    for (let run = 1; run <= runs; run++) {
      console.log(`Running simulation ${run}/${runs}`);
      
      const game = new BulletBuzzGame(gameConfig);
      let result = {
        run,
        level: 1,
        time: 0,
        reachedTarget: false,
        timeout: false,
        finalStats: {}
      };
      
      // Run the game until completion, death, or timeout
      while (game.player.hp > 0 && !game.hasReachedLevel(targetLevel) && game.gameTime < maxTime) {
        game.step();
      }
      
      // Record results
      const gameState = game.getGameState();
      result.level = gameState.level;
      result.time = gameState.gameTime;
      result.reachedTarget = game.hasReachedLevel(targetLevel);
      result.timeout = game.gameTime >= maxTime;
      result.finalStats = {
        enemiesKilled: gameState.enemiesKilled,
        xpCollected: gameState.xpCollected,
        heartsCollected: gameState.heartsCollected,
        axesThrown: gameState.axesThrown,
        levelTimes: gameState.levelTimes
      };
      
      this.results.push(result);
      
      // Log level progression
      Object.keys(gameState.levelTimes).forEach(level => {
        console.log(`Level ${level}: ${gameState.levelTimes[level]}`);
      });
    }
    
    this.printResults(targetLevel);
  }
  
  printResults(targetLevel) {
    const successfulRuns = this.results.filter(r => r.reachedTarget);
    const failedRuns = this.results.filter(r => !r.reachedTarget && !r.timeout);
    const timeoutRuns = this.results.filter(r => r.timeout);
    const successRate = (successfulRuns.length / this.results.length) * 100;
    const avgTime = this.results.reduce((sum, r) => sum + r.time, 0) / this.results.length;
    const avgLevel = this.results.reduce((sum, r) => sum + r.level, 0) / this.results.length;
    
    console.log('\n=== SIMULATION RESULTS ===');
    console.log(`Target Level: ${targetLevel}`);
    console.log(`Total Runs: ${this.results.length}`);
    console.log(`Success Rate: ${successRate.toFixed(1)}%`);
    console.log(`Successful Runs: ${successfulRuns.length}`);
    console.log(`Failed Runs: ${failedRuns.length}`);
    console.log(`Timeout Runs: ${timeoutRuns.length}`);
    console.log(`Average Time: ${(avgTime / 60).toFixed(2)} minutes`);
    console.log(`Average Level: ${avgLevel.toFixed(1)}`);
    
    console.log('\nDetailed Runs:');
    this.results.forEach((r) => {
      const runMinutes = Math.floor(r.time / 60);
      const runSeconds = Math.floor(r.time % 60);
      const runTimeString = `${runMinutes.toString().padStart(2, '0')}:${runSeconds.toString().padStart(2, '0')}`;
      const status = r.reachedTarget ? '✅' : r.timeout ? '⏰' : '❌';
      console.log(`Run ${r.run}: Level ${r.level} at ${runTimeString} ${status}`);
    });
    
    console.log('\n=== END SIMULATION ===');
  }
  
  // Test different configurations
  testConfigurations() {
    const configs = [
      {
        name: "Current Settings",
        gameConfig: {
          startHp: 12,
          pickupRange: 25,
          playerSpeed: 0.85,
          enemySpeed: 0.15,
          spawnInterval: 8000,
          heartDropRate: 0.20,
          avoidDistance: 120,
          avoidStrength: 2.0,
          singleEnemyLevel: 6,
          minSpawnInterval: 4500
        }
      },
      {
        name: "Faster XP Gain",
        gameConfig: {
          startHp: 12,
          pickupRange: 30,
          playerSpeed: 1.0,
          enemySpeed: 0.1,
          spawnInterval: 6000,
          heartDropRate: 0.25,
          avoidDistance: 150,
          avoidStrength: 2.5,
          singleEnemyLevel: 6,
          minSpawnInterval: 3000
        }
      }
    ];
    
    configs.forEach(config => {
      console.log(`\n\n=== TESTING: ${config.name} ===`);
      this.results = []; // Clear previous results
      this.runSimulation({
        runs: 5,
        targetLevel: 5,
        maxTime: 300,
        gameConfig: config.gameConfig
      });
    });
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const simulator = new GameSimulator();
  
  if (process.argv.includes('--test-configs')) {
    simulator.testConfigurations();
  } else {
    simulator.runSimulation({
      runs: 10,
      targetLevel: 5,
      maxTime: 300,
      gameConfig: {
        startHp: 12,
        pickupRange: 25,
        playerSpeed: 0.85,
        enemySpeed: 0.15,
        spawnInterval: 8000,
        heartDropRate: 0.20,
        avoidDistance: 120,
        avoidStrength: 2.0,
        singleEnemyLevel: 6,
        minSpawnInterval: 4500
      }
    });
  }
}

export default GameSimulator; 