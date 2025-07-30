// Headless game testing for terminal
const fs = require('fs');

// Mock canvas and DOM elements
global.canvas = { width: 800, height: 600 };
global.ctx = {
  clearRect: () => {},
  fillText: () => {},
  fillRect: () => {},
  strokeRect: () => {},
  beginPath: () => {},
  arc: () => {},
  stroke: () => {},
  fill: () => {},
  setLineDash: () => {},
  save: () => {},
  translate: () => {},
  rotate: () => {},
  restore: () => {},
  strokeStyle: '',
  fillStyle: '',
  lineWidth: 0,
  font: '',
  textAlign: '',
  textBaseline: ''
};

// Mock DOM elements
global.document = {
  getElementById: (id) => ({
    checked: true,
    value: '10',
    textContent: '',
    innerText: '',
    style: { display: '' },
    addEventListener: () => {}
  })
};

// Game state variables
let gameTime = 0;
let frameCount = 0;
let level = 1;
let score = 0;
let enemiesKilled = 0;
let xpCollected = 0;
let heartsCollected = 0;
let axesThrown = 0;
let enemiesSpawned = 0;
let levelTimes = {};
let gameStatePrinted = false;
let simulationMode = false;
let simulationResults = [];

// Game objects
const player = {
  x: 400,
  y: 300,
  radius: 15,
  speed: 0.85,
  hp: 12,
  maxHp: 12,
  pickupRange: 25,
  attackRange: 86.25,
  hitTimer: 0
};

const enemies = [];
const xpDrops = [];
const heartDrops = [];
const axes = [];
const keys = {};

// Game parameters (from sliders)
let baseSpawnInterval = 8000;
let enemySpeed = 0.15;
let heartDropRate = 0.20;
let avoidDistance = 120;
let avoidStrength = 2.0;
let singleEnemyLevel = 6;
let minSpawnInterval = 4500;

// Game mechanics
let spawnTimer = 0;
let paused = false;
let showShop = false;
let autoShopSelected = false;
let projectileCount = 1;
let playerAttackSpeed = 1.0;

function spawnEnemy() {
  const angle = Math.random() * 2 * Math.PI;
  const distance = 300;
  let spawnX = player.x + Math.cos(angle) * distance;
  let spawnY = player.y + Math.sin(angle) * distance;
  
  // Ensure enemies spawn within canvas bounds
  spawnX = Math.max(10, Math.min(canvas.width - 10, spawnX));
  spawnY = Math.max(10, Math.min(canvas.height - 10, spawnY));
  
  const enemy = {
    attackCooldown: 0,
    x: spawnX,
    y: spawnY,
    radius: 10,
    speed: enemySpeed
  };
  
  enemies.push(enemy);
  enemiesSpawned++;
  console.log(`Spawned enemy at (${Math.round(spawnX)}, ${Math.round(spawnY)}), total enemies: ${enemies.length}`);
}

function conditionalSpawn() {
  if (!paused && !showShop && player.hp > 0) {
    const groupSize = level <= singleEnemyLevel ? 1 : Math.min(Math.floor(level / 4) + 1, 2);
    console.log(`Conditional spawn: level ${level}, groupSize ${groupSize}, singleEnemyLevel ${singleEnemyLevel}`);
    for (let i = 0; i < groupSize; i++) {
      spawnEnemy();
    }
    
    // Heart drops
    if (Math.random() < heartDropRate) {
      heartDrops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 8
      });
    }
  }
}

function shootAxe() {
  if (enemies.length === 0) return;
  const inRangeEnemies = enemies.filter(e => Math.hypot(e.x - player.x, e.y - player.y) <= player.attackRange);
  const targets = inRangeEnemies.length > 0 ? inRangeEnemies : Array.from({ length: projectileCount }, () => ({ x: player.x + Math.random() * 200 - 100, y: player.y + Math.random() * 200 - 100 }));
  
  for (let i = 0; i < projectileCount; i++) {
    const target = targets[i % targets.length];
    const dx = target.x - player.x;
    const dy = target.y - player.y;
    const dist = Math.hypot(dx, dy);
    const leadTime = dist / 4;
    const predictedX = target.x + (target.vx || 0) * leadTime;
    const predictedY = target.y + (target.vy || 0) * leadTime;
    const angle = Math.atan2(predictedY - player.y, predictedX - player.x);
    axes.push({
      x: player.x,
      y: player.y,
      vx: Math.cos(angle) * 4,
      vy: Math.sin(angle) * 4,
      rotation: 0
    });
    axesThrown += projectileCount;
  }
}

function update() {
  // Dynamic enemy spawning
  spawnTimer++;
  const spawnInterval = level <= singleEnemyLevel ? 
    Math.max(minSpawnInterval, baseSpawnInterval - (level * 2)) : 
    Math.max(1200, baseSpawnInterval - (level * 15));
  if (spawnTimer >= spawnInterval / 16) {
    conditionalSpawn();
    spawnTimer = 0;
  }
  
  // Auto-pathing logic
  const autoPath = true; // Always enabled for headless testing
  if (autoPath) {
    const avoidDist = avoidDistance;
    const avoidStr = avoidStrength;
    let dx = 0, dy = 0;

    enemies.forEach(e => {
      const d = Math.hypot(player.x - e.x, player.y - e.y);
      if (d < avoidDist) {
        dx += (player.x - e.x) / d * avoidStr;
        dy += (player.y - e.y) / d * avoidStr;
      }
    });

    // Only target hearts if not at max HP
    let availableTargets = [...xpDrops];
    if (player.hp < player.maxHp) {
      availableTargets = availableTargets.concat(heartDrops);
    }
    
    let target = availableTargets.sort((a, b) => {
      return Math.hypot(player.x - a.x, player.y - b.y) - Math.hypot(player.x - b.x, player.y - b.y);
    })[0];

    if (target) {
      const d = Math.hypot(target.x - player.x, target.y - player.y);
      dx += (target.x - player.x) / d;
      dy += (target.y - player.y) / d;
    }

    const len = Math.hypot(dx, dy);
    if (len > 0) {
      player.x += (dx / len) * player.speed;
      player.y += (dy / len) * player.speed;
    }
  }
  
  // Heart drops
  for (let i = heartDrops.length - 1; i >= 0; i--) {
    const heart = heartDrops[i];
    const dx = player.x - heart.x;
    const dy = player.y - heart.y;
    const dist = Math.hypot(dx, dy);
    if (dist < player.pickupRange * 4) {
      heart.x += dx / dist * 2;
      heart.y += dy / dist * 2;
    }
    if (dist < player.pickupRange + heart.r) {
      heartDrops.splice(i, 1);
      player.hp = Math.min(player.maxHp, player.hp + 1);
      heartsCollected++;
    }
  }
  
  // XP drops
  for (let i = xpDrops.length - 1; i >= 0; i--) {
    const xp = xpDrops[i];
    const dx = player.x - xp.x;
    const dy = player.y - xp.y;
    const dist = Math.hypot(dx, dy);
    if (dist < player.pickupRange * 4) {
      xp.x += dx / dist * 2;
      xp.y += dy / dist * 2;
    }
    if (dist < player.pickupRange + xp.r) {
      xpDrops.splice(i, 1);
      score += 1;
      xpCollected++;
      const levelThreshold = 10 * level;
      if (score % levelThreshold === 0 && score !== 0) {
        level++;
        const minutes = Math.floor(gameTime / 60);
        const seconds = Math.floor(gameTime % 60);
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        levelTimes[level] = timeString;
        console.log(`Level up! Level ${level} at ${timeString}`);
      }
    }
  }
  
  // Player bounds
  player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
  player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));

  // Axes physics
  axes.forEach((axe) => {
    axe.vy += 0.1;
    axe.x += axe.vx;
    axe.y += axe.vy;
    axe.rotation += 0.3;
  });

  // Enemy movement
  enemies.forEach((e) => {
    const dx = player.x - e.x;
    const dy = player.y - e.y;
    const dist = Math.hypot(dx, dy);
    
    // Only move if distance is greater than 0 to avoid division by zero
    if (dist > 0) {
      e.x += (dx / dist) * e.speed;
      e.y += (dy / dist) * e.speed;
    }
    
    // Keep enemies within canvas bounds
    e.x = Math.max(e.radius, Math.min(canvas.width - e.radius, e.x));
    e.y = Math.max(e.radius, Math.min(canvas.height - e.radius, e.y));
  });

  // Axe collision with enemies
  for (let i = axes.length - 1; i >= 0; i--) {
    const axe = axes[i];
    let hit = false;
    for (let j = enemies.length - 1; j >= 0; j--) {
      const e = enemies[j];
      const dx = axe.x - e.x;
      const dy = axe.y - e.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 15) {
        const dead = enemies.splice(j, 1)[0];
        xpDrops.push({ x: dead.x, y: dead.y, r: 5 });
        enemiesKilled++;
        hit = true;
        break;
      }
    }
    if (hit) axes.splice(i, 1);
  }

  // Enemy attack
  enemies.forEach((e) => {
    if (e.attackCooldown > 0) e.attackCooldown--;
    const dist = Math.hypot(player.x - e.x, player.y - e.y);
    if (dist < player.radius + e.radius && e.attackCooldown === 0) {
      player.hp -= 1;
      player.hitTimer = 10;
      e.attackCooldown = 60;
    }
  });
  
  // Auto-shoot
  if (!paused && !showShop && player.hp > 0) {
    shootAxe();
  }
}

function gameLoop() {
  if (!paused && player.hp > 0) {
    update();
    gameTime += 1/60; // Assuming 60 FPS
  }
  
  // Continue game loop - run at high speed for simulations
  if (player.hp > 0 && !simulationMode) {
    setTimeout(gameLoop, 16); // ~60 FPS
  } else if (simulationMode && player.hp > 0) {
    // For simulations, run as fast as possible
    setImmediate(gameLoop);
  }
  // If simulation mode and player is dead, don't continue
}

function resetGameState() {
  // Reset all game variables
  player.x = 400;
  player.y = 300;
  player.hp = 12;
  player.maxHp = 12;
  player.speed = 0.85;
  player.pickupRange = 25;
  player.attackRange = 86.25;
  player.hitTimer = 0;
  
  // Clear arrays
  enemies.length = 0;
  xpDrops.length = 0;
  heartDrops.length = 0;
  axes.length = 0;
  
  // Reset counters
  gameTime = 0;
  frameCount = 0;
  level = 1;
  score = 0;
  enemiesKilled = 0;
  xpCollected = 0;
  heartsCollected = 0;
  axesThrown = 0;
  enemiesSpawned = 0;
  levelTimes = {};
  gameStatePrinted = false;
  simulationMode = false;
  simulationResults = [];
  spawnTimer = 0;
  paused = false;
  showShop = false;
  autoShopSelected = false;
  projectileCount = 1;
  playerAttackSpeed = 1.0;
  
  // Reset keys state
  keys = {};
}

function runSimulation(totalRuns, targetLevel, maxTime, currentRun) {
  if (currentRun >= totalRuns) {
    finishSimulation();
    return;
  }
  
  console.log(`Running simulation ${currentRun + 1}/${totalRuns}`);
  
  // Reset game state
  resetGameState();
  
  // Start the game
  gameLoop();
  
  // Check for completion, death, or timeout - check more frequently for faster results
  const checkInterval = setInterval(() => {
    if (player.hp <= 0) {
      // Game over - record results
      const result = {
        run: currentRun + 1,
        level: level,
        time: gameTime,
        reachedTarget: level >= targetLevel,
        timeout: false,
        finalStats: {
          enemiesKilled,
          xpCollected,
          heartsCollected,
          axesThrown,
          levelTimes: {...levelTimes}
        }
      };
      simulationResults.push(result);
      
      clearInterval(checkInterval);
      runSimulation(totalRuns, targetLevel, maxTime, currentRun + 1);
    } else if (level >= targetLevel) {
      // Target reached - record results
      const result = {
        run: currentRun + 1,
        level: level,
        time: gameTime,
        reachedTarget: true,
        timeout: false,
        finalStats: {
          enemiesKilled,
          xpCollected,
          heartsCollected,
          axesThrown,
          levelTimes: {...levelTimes}
        }
      };
      simulationResults.push(result);
      
      clearInterval(checkInterval);
      runSimulation(totalRuns, targetLevel, maxTime, currentRun + 1);
    } else if (gameTime >= maxTime) {
      // Timeout - record results
      const result = {
        run: currentRun + 1,
        level: level,
        time: gameTime,
        reachedTarget: false,
        timeout: true,
        finalStats: {
          enemiesKilled,
          xpCollected,
          heartsCollected,
          axesThrown,
          levelTimes: {...levelTimes}
        }
      };
      simulationResults.push(result);
      
      clearInterval(checkInterval);
      runSimulation(totalRuns, targetLevel, maxTime, currentRun + 1);
    }
  }, 50); // Check every 50ms instead of 100ms for faster simulation
}

function finishSimulation() {
  const targetLevel = 5; // Default target
  const successfulRuns = simulationResults.filter(r => r.reachedTarget);
  const successRate = (successfulRuns.length / simulationResults.length) * 100;
  const avgTime = simulationResults.reduce((sum, r) => sum + r.time, 0) / simulationResults.length;
  const avgLevel = simulationResults.reduce((sum, r) => sum + r.level, 0) / simulationResults.length;
  
  console.log('\n=== SIMULATION RESULTS ===');
  console.log(`Target Level: ${targetLevel}`);
  console.log(`Total Runs: ${simulationResults.length}`);
  console.log(`Success Rate: ${successRate.toFixed(1)}%`);
  console.log(`Successful Runs: ${successfulRuns.length}`);
  console.log(`Failed Runs: ${simulationResults.filter(r => !r.reachedTarget && !r.timeout).length}`);
  console.log(`Timeout Runs: ${simulationResults.filter(r => r.timeout).length}`);
  console.log(`Average Time: ${(avgTime / 60).toFixed(2)} minutes`);
  console.log(`Average Level: ${avgLevel.toFixed(1)}`);
  
  console.log('\nDetailed Runs:');
  simulationResults.forEach((r, i) => {
    const runMinutes = Math.floor(r.time / 60);
    const runSeconds = Math.floor(r.time % 60);
    const runTimeString = `${runMinutes.toString().padStart(2, '0')}:${runSeconds.toString().padStart(2, '0')}`;
    const status = r.reachedTarget ? '✅' : r.timeout ? '⏰' : '❌';
    console.log(`Run ${r.run}: Level ${r.level} at ${runTimeString} ${status}`);
  });
  
  console.log('\n=== END SIMULATION ===');
}

// CLI interface
function startSimulation() {
  const runs = 10;
  const targetLevel = 5;
  const maxTime = 300; // 5 minutes
  
  console.log(`Starting simulation: ${runs} runs, target level ${targetLevel}, max time ${maxTime}s`);
  
  simulationMode = true;
  simulationResults = [];
  
  runSimulation(runs, targetLevel, maxTime, 0);
}

// Run if called directly
if (require.main === module) {
  console.log('Starting headless game simulation...');
  startSimulation();
}

module.exports = {
  startSimulation,
  resetGameState,
  gameLoop,
  update
}; 