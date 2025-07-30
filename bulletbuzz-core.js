/**
 * BulletBuzz Core Game Logic
 * A headless version for testing and simulation
 * 
 * Core Features:
 * - Auto-pathing player that collects XP and avoids enemies
 * - Enemy spawning and movement
 * - XP-based leveling system
 * - Heart drops for healing
 * - Auto-attacking with axes
 * - Configurable balance parameters
 * - Fixed timestep game loop for consistent performance
 */

class BulletBuzzGame {
  constructor(config = {}) {
    // Game state
    this.gameTime = 0;
    this.level = 1;
    this.score = 0;
    this.enemiesKilled = 0;
    this.xpCollected = 0;
    this.heartsCollected = 0;
    this.axesThrown = 0;
    this.enemiesSpawned = 0;
    this.levelTimes = {};
    
    // Fixed timestep variables
    this.accumulator = 0;
    this.timestep = 1/60; // 60 FPS fixed timestep
    
    // Memory management - maximum array sizes
    this.maxEnemies = 100;
    this.maxXpDrops = 200;
    this.maxHeartDrops = 50;
    this.maxAxes = 50;
    
    // Game objects
    this.player = {
      x: 400,
      y: 300,
      radius: 15,
      speed: config.playerSpeed || 0.85,
      hp: config.startHp || 12,
      maxHp: config.startHp || 12,
      pickupRange: config.pickupRange || 8,
      attackRange: config.attackRange || 86.25,
      hitTimer: 0
    };
    
    this.enemies = [];
    this.xpDrops = [];
    this.heartDrops = [];
    this.axes = [];
    
    // Game parameters
    this.baseSpawnInterval = config.spawnInterval || 5000;
    this.enemySpeed = config.enemySpeed || 0.25;
    this.heartDropRate = config.heartDropRate || 0.15;
    this.avoidDistance = config.avoidDistance || 80; // Reduced from 120
    this.avoidStrength = config.avoidStrength || 0.8; // Reduced from 2.0
    this.fleeRange = config.fleeRange || 25; // Reduced flee range for more aggressive play
    this.fleeStrength = config.fleeStrength || 1.5; // Stronger than avoid strength
    this.singleEnemyLevel = config.singleEnemyLevel || 4;
    this.minSpawnInterval = config.minSpawnInterval || 3000;
    this.levelScaling = config.levelScaling || 40; // Doubled from 20
    this.earlyLevelScaling = config.earlyLevelScaling || 6; // Doubled from 3
    
    // Combat parameters
    this.attackRange = config.attackRange || 86.25;
    this.projectileCount = config.projectileCount || 1;
    this.projectileSpeed = config.projectileSpeed || 4;
    this.attackSpeed = config.attackSpeed || 1.0;
    
    // Game mechanics
    this.spawnTimer = 0;
    this.paused = false;
    this.showShop = false;
    this.attackTimer = 0;
    this.autoPathing = config.autoPathing !== false; // Default to true unless explicitly disabled
    
    // Robot vacuum wandering
    this.wanderDirection = Math.random() * 2 * Math.PI; // Random initial direction
    this.wanderTimer = 0;
    this.wanderInterval = 180; // Change direction every 3 seconds (180 frames)
    this.lastKilledEnemy = null; // Track last killed enemy position
    
    // Canvas dimensions (for bounds checking)
    this.canvasWidth = 800;
    this.canvasHeight = 600;
    
    // Shop system
    this.shopOptions = [];
    this.autoShopSelected = false;
    this.upgradePool = [
      { key: '1', label: '⚡ +0.1 Speed', apply: () => this.player.speed += 0.1 },
      { key: '2', label: '🎯 +5 Attack Range', apply: () => this.player.attackRange += 5 },
      { key: '3', label: '🪓 +1 Projectile', apply: () => this.projectileCount++ },
      { key: '4', label: '💨 +0.2 Attack Speed', apply: () => this.attackSpeed += 0.2 },
      { key: '5', label: '📏 +2 Pickup Range', apply: () => this.player.pickupRange += 2 }
    ];
  }
  
  spawnEnemy() {
    // Check if we've reached the maximum number of enemies
    if (this.enemies.length >= this.maxEnemies) {
      return;
    }
    
    const angle = Math.random() * 2 * Math.PI;
    const distance = 300;
    let spawnX = this.player.x + Math.cos(angle) * distance;
    let spawnY = this.player.y + Math.sin(angle) * distance;
    
    // Ensure enemies spawn within canvas bounds
    spawnX = Math.max(10, Math.min(this.canvasWidth - 10, spawnX));
    spawnY = Math.max(10, Math.min(this.canvasHeight - 10, spawnY));
    
    // Determine enemy type based on level
    const isWasp = this.level >= 3 && Math.random() < 0.3; // 30% chance of wasp at level 3+
    
    const enemy = {
      attackCooldown: 0,
      x: spawnX,
      y: spawnY,
      radius: isWasp ? 12 : 10,
      speed: isWasp ? this.enemySpeed * 1.5 : this.enemySpeed,
      type: isWasp ? 'wasp' : 'bee',
      hp: isWasp ? 2 : 1,
      maxHp: isWasp ? 2 : 1,
      lifetime: 0 // Track enemy lifetime for cleanup
    };
    
    this.enemies.push(enemy);
    this.enemiesSpawned++;
  }
  
  conditionalSpawn() {
    if (!this.paused && !this.showShop && this.player.hp > 0) {
      // Much more aggressive enemy scaling
      const groupSize = this.level <= this.singleEnemyLevel ? 1 : Math.min(Math.floor(this.level / 2) + 2, 8);
      
      for (let i = 0; i < groupSize; i++) {
        this.spawnEnemy();
      }
      
      // Heart drops
      if (Math.random() < this.heartDropRate && this.heartDrops.length < this.maxHeartDrops) {
        this.heartDrops.push({
          x: Math.random() * this.canvasWidth,
          y: Math.random() * this.canvasHeight,
          r: 8,
          lifetime: 0
        });
      }
    }
  }
  
  shootAxe() {
    if (this.enemies.length === 0) return;
    
    const inRangeEnemies = this.enemies.filter(e => 
      Math.hypot(e.x - this.player.x, e.y - this.player.y) <= this.player.attackRange
    );
    
    const targets = inRangeEnemies.length > 0 ? inRangeEnemies : 
      Array.from({ length: this.projectileCount }, () => ({ 
        x: this.player.x + Math.random() * 200 - 100, 
        y: this.player.y + Math.random() * 200 - 100 
      }));
    
    for (let i = 0; i < this.projectileCount; i++) {
      const target = targets[i % targets.length];
      const dx = target.x - this.player.x;
      const dy = target.y - this.player.y;
      const dist = Math.hypot(dx, dy);
      const leadTime = dist / this.projectileSpeed;
      const predictedX = target.x + (target.vx || 0) * leadTime;
      const predictedY = target.y + (target.vy || 0) * leadTime;
      const angle = Math.atan2(predictedY - this.player.y, predictedX - this.player.x);
      
      // Only add axe if we haven't reached the limit
      if (this.axes.length < this.maxAxes) {
        this.axes.push({
          x: this.player.x,
          y: this.player.y,
          vx: Math.cos(angle) * this.projectileSpeed * 2, // Double the horizontal speed
          vy: Math.sin(angle) * this.projectileSpeed * 2, // Double the vertical speed
          rotation: 0,
          lifetime: 0 // Track how long the axe has existed
        });
        this.axesThrown += this.projectileCount;
      }
    }
  }
  
  update() {
    // Dynamic enemy spawning
    this.spawnTimer++;
    const spawnInterval = this.level <= this.singleEnemyLevel ? 
      Math.max(this.minSpawnInterval, this.baseSpawnInterval - (this.level * this.earlyLevelScaling)) : 
      Math.max(600, this.baseSpawnInterval - (this.level * this.levelScaling));
    
    if (this.spawnTimer >= spawnInterval / 16) {
      this.conditionalSpawn();
      this.spawnTimer = 0;
    }
    
    // Auto-pathing logic (only if enabled and shop is not open)
    if (this.autoPathing && !this.showShop) {
      let dx = 0, dy = 0;

      // Enemy fleeing (high priority - avoid damage)
      this.enemies.forEach(e => {
        const d = Math.hypot(this.player.x - e.x, this.player.y - e.y);
        if (d < this.fleeRange) {
          // Strong flee when enemies are very close
          dx += (this.player.x - e.x) / d * this.player.speed * this.fleeStrength;
          dy += (this.player.y - e.y) / d * this.player.speed * this.fleeStrength;
        }
      });

      // Check if any enemies are in attack range
      const enemiesInRange = this.enemies.filter(e => {
        const d = Math.hypot(this.player.x - e.x, this.player.y - e.y);
        return d > this.fleeRange && d < this.player.attackRange * 0.8;
      });
      
               if (enemiesInRange.length > 0) {
           // Seek enemies within attack range (combat mode)
           const closestEnemy = enemiesInRange.sort((a, b) => {
             const distA = Math.hypot(this.player.x - a.x, this.player.y - a.y);
             const distB = Math.hypot(this.player.x - b.x, this.player.y - b.y);
             return distA - distB;
           })[0];

           const d = Math.hypot(this.player.x - closestEnemy.x, this.player.y - closestEnemy.y);
           dx += (closestEnemy.x - this.player.x) / d * this.player.speed * 0.3;
           dy += (closestEnemy.y - this.player.y) / d * this.player.speed * 0.3;
                  } else {
           // Robot vacuum wandering (when no enemies in range)
           if (this.lastKilledEnemy) {
             // Seek the last killed enemy position
             const d = Math.hypot(this.lastKilledEnemy.x - this.player.x, this.lastKilledEnemy.y - this.player.y);
             if (d > 5) { // Only move if not very close to the position
               dx += (this.lastKilledEnemy.x - this.player.x) / d * this.player.speed * 0.3;
               dy += (this.lastKilledEnemy.y - this.player.y) / d * this.player.speed * 0.3;
             } else {
               // Clear the target when we reach it
               this.lastKilledEnemy = null;
             }
           } else {
             // Random wandering when no last killed enemy
             this.wanderTimer++;

             // Change direction periodically
             if (this.wanderTimer >= this.wanderInterval) {
               this.wanderDirection = Math.random() * 2 * Math.PI;
               this.wanderTimer = 0;
             }

             // Move in current wander direction
             dx += Math.cos(this.wanderDirection) * this.player.speed * 0.2;
             dy += Math.sin(this.wanderDirection) * this.player.speed * 0.2;
           }
           
           // No wall avoidance - allow full access to canvas for XP collection
         }

               // Target collection (XP and hearts) - lowest priority
         let availableTargets = [...this.xpDrops];
         const healthPercentage = this.player.hp / this.player.maxHp;
         
         // Prioritize hearts when health is below 50%
         if (healthPercentage < 0.5) {
           availableTargets = this.heartDrops.concat(availableTargets);
         } else if (this.player.hp < this.player.maxHp) {
           availableTargets = availableTargets.concat(this.heartDrops);
         }

         let target = availableTargets.sort((a, b) => {
           return Math.hypot(this.player.x - a.x, this.player.y - a.y) -
                  Math.hypot(this.player.x - b.x, this.player.y - b.y);
         })[0];

         if (target) {
           const d = Math.hypot(target.x - this.player.x, target.y - this.player.y);
           dx += (target.x - this.player.x) / d * this.player.speed * 0.2;
           dy += (target.y - this.player.y) / d * this.player.speed * 0.2;
         }

               const len = Math.hypot(dx, dy);
         if (len > 0) {
           this.player.x += (dx / len) * this.player.speed;
           this.player.y += (dy / len) * this.player.speed;
           
                    // Keep player within bounds (allow going to edges for XP collection)
         this.player.x = Math.max(this.player.radius, Math.min(this.canvasWidth - this.player.radius, this.player.x));
         this.player.y = Math.max(this.player.radius, Math.min(this.canvasHeight - this.player.radius, this.player.y));
         }
    }
    
    // Heart drops
    for (let i = this.heartDrops.length - 1; i >= 0; i--) {
      const heart = this.heartDrops[i];
      heart.lifetime++;
      
      // Remove hearts after 30 seconds (1800 frames at 60 FPS)
      if (heart.lifetime > 1800) {
        this.heartDrops.splice(i, 1);
        continue;
      }
      
      const dx = this.player.x - heart.x;
      const dy = this.player.y - heart.y;
      const dist = Math.hypot(dx, dy);
      if (dist < this.player.pickupRange * 4) {
        heart.x += dx / dist * 2;
        heart.y += dy / dist * 2;
      }
      if (dist < this.player.pickupRange + heart.r) {
        this.heartDrops.splice(i, 1);
        this.player.hp = Math.min(this.player.maxHp, this.player.hp + 1);
        this.heartsCollected++;
      }
    }
    
    // XP drops
    for (let i = this.xpDrops.length - 1; i >= 0; i--) {
      const xp = this.xpDrops[i];
      xp.lifetime = (xp.lifetime || 0) + 1;
      
      // Remove XP drops after 60 seconds (3600 frames at 60 FPS)
      if (xp.lifetime > 3600) {
        this.xpDrops.splice(i, 1);
        continue;
      }
      
      const dx = this.player.x - xp.x;
      const dy = this.player.y - xp.y;
      const dist = Math.hypot(dx, dy);
      if (dist < this.player.pickupRange * 4) {
        xp.x += dx / dist * 2;
        xp.y += dy / dist * 2;
      }
      if (dist < this.player.pickupRange + xp.r) {
        this.xpDrops.splice(i, 1);
        this.score += 1;
        this.xpCollected++;
        const levelThreshold = Math.floor(10 * Math.pow(1.5, this.level - 1));
        if (this.score % levelThreshold === 0 && this.score !== 0) {
          this.level++;
          const minutes = Math.floor(this.gameTime / 60);
          const seconds = Math.floor(this.gameTime % 60);
          const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          this.levelTimes[this.level] = timeString;
          
          // Show shop
          this.showShop = true;
          this.autoShopSelected = false;
          this.shopOptions = this.upgradePool.concat({ 
            key: '6', 
            label: '❤️ +1 Max HP', 
            apply: () => this.player.maxHp++ 
          }).sort(() => 0.5 - Math.random()).slice(0, 3)
          .map((opt, i) => ({ ...opt, key: (i + 1).toString() }));
        }
      }
    }
    
    // Player bounds
    this.player.x = Math.max(this.player.radius, Math.min(this.canvasWidth - this.player.radius, this.player.x));
    this.player.y = Math.max(this.player.radius, Math.min(this.canvasHeight - this.player.radius, this.player.y));

    // Axes physics and cleanup
    for (let i = this.axes.length - 1; i >= 0; i--) {
      const axe = this.axes[i];
      axe.lifetime++;
      
      // Increased gravity for faster decay
      axe.vy += 0.15;
      
      // Add air resistance (slow down over time)
      axe.vx *= 0.98;
      axe.vy *= 0.98;
      
      axe.x += axe.vx;
      axe.y += axe.vy;
      axe.rotation += 0.3;
      
      // Remove axes that go off-screen, fall too far, or expire
      if (axe.x < -50 || axe.x > this.canvasWidth + 50 || 
          axe.y < -50 || axe.y > this.canvasHeight + 50 ||
          axe.lifetime > 120) { // Remove after 2 seconds (120 frames at 60fps)
        this.axes.splice(i, 1);
      }
    }

    // Enemy movement and cleanup
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      e.lifetime = (e.lifetime || 0) + 1;
      
      // Remove enemies that are too far from player (despawn after 30 seconds)
      const distanceToPlayer = Math.hypot(this.player.x - e.x, this.player.y - e.y);
      if (distanceToPlayer > 1000 || e.lifetime > 1800) { // 30 seconds at 60 FPS
        this.enemies.splice(i, 1);
        continue;
      }
      
      const dx = this.player.x - e.x;
      const dy = this.player.y - e.y;
      const dist = Math.hypot(dx, dy);
      
      // Only move if distance is greater than 0 to avoid division by zero
      if (dist > 0) {
        e.x += (dx / dist) * e.speed;
        e.y += (dy / dist) * e.speed;
      }
      
      // Keep enemies within canvas bounds
      e.x = Math.max(e.radius, Math.min(this.canvasWidth - e.radius, e.x));
      e.y = Math.max(e.radius, Math.min(this.canvasHeight - e.radius, e.y));
    }

    // Axe collision with enemies
    for (let i = this.axes.length - 1; i >= 0; i--) {
      const axe = this.axes[i];
      let hit = false;
      for (let j = this.enemies.length - 1; j >= 0; j--) {
        const e = this.enemies[j];
        const dx = axe.x - e.x;
        const dy = axe.y - e.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 15) {
          const e = this.enemies[j];
          e.hp--;
          
          if (e.hp <= 0) {
            const dead = this.enemies.splice(j, 1)[0];
            // Only add XP drop if we haven't reached the limit
            if (this.xpDrops.length < this.maxXpDrops) {
              this.xpDrops.push({ x: dead.x, y: dead.y, r: 5, lifetime: 0 });
            }
            this.enemiesKilled++;
            this.lastKilledEnemy = { x: dead.x, y: dead.y }; // Track last killed enemy position
          }
          hit = true;
          break;
        }
      }
      if (hit) this.axes.splice(i, 1);
    }

    // Enemy attack
    this.enemies.forEach((e) => {
      if (e.attackCooldown > 0) e.attackCooldown--;
      const dist = Math.hypot(this.player.x - e.x, this.player.y - e.y);
      if (dist < this.player.radius + e.radius && e.attackCooldown === 0) {
        this.player.hp -= 1;
        this.player.hitTimer = 10;
        e.attackCooldown = 60;
      }
    });
    
    // Auto-shoot with timer
    this.attackTimer++;
    const attackInterval = 60 / this.attackSpeed; // Convert APS to frames
    if (!this.paused && !this.showShop && this.player.hp > 0 && this.attackTimer >= attackInterval) {
      this.shootAxe();
      this.attackTimer = 0;
    }
  }
  
  step(deltaTime = 1/60) {
    if (!this.paused && !this.showShop && this.player.hp > 0) {
      // Fixed timestep with accumulator
      this.accumulator += deltaTime;
      
      // Update at fixed timestep
      while (this.accumulator >= this.timestep) {
        this.update();
        this.gameTime += this.timestep;
        this.accumulator -= this.timestep;
      }
    }
  }
  
  reset() {
    // Reset all game variables
    this.player.x = 400;
    this.player.y = 300;
    this.player.hp = this.player.maxHp;
    this.player.hitTimer = 0;
    
    // Clear arrays
    this.enemies.length = 0;
    this.xpDrops.length = 0;
    this.heartDrops.length = 0;
    this.axes.length = 0;
    
    // Reset counters
    this.gameTime = 0;
    this.level = 1;
    this.score = 0;
    this.enemiesKilled = 0;
    this.xpCollected = 0;
    this.heartsCollected = 0;
    this.axesThrown = 0;
    this.enemiesSpawned = 0;
    this.levelTimes = {};
    this.spawnTimer = 0;
    this.paused = false;
    this.showShop = false;
    this.shopOptions = [];
    this.autoShopSelected = false;
    
    // Reset timestep variables
    this.accumulator = 0;
  }
  
  // Memory cleanup method
  cleanup() {
    // Force garbage collection of arrays
    this.enemies.length = 0;
    this.xpDrops.length = 0;
    this.heartDrops.length = 0;
    this.axes.length = 0;
    
    // Clear references
    this.lastKilledEnemy = null;
    this.shopOptions = [];
    
    // Reset timestep
    this.accumulator = 0;
  }
  
  // Memory monitoring method
  getMemoryUsage() {
    return {
      enemies: this.enemies.length,
      xpDrops: this.xpDrops.length,
      heartDrops: this.heartDrops.length,
      axes: this.axes.length,
      maxEnemies: this.maxEnemies,
      maxXpDrops: this.maxXpDrops,
      maxHeartDrops: this.maxHeartDrops,
      maxAxes: this.maxAxes
    };
  }
  
  getGameState() {
    return {
      gameTime: this.gameTime,
      level: this.level,
      score: this.score,
      player: { ...this.player },
      enemiesKilled: this.enemiesKilled,
      xpCollected: this.xpCollected,
      heartsCollected: this.heartsCollected,
      axesThrown: this.axesThrown,
      enemiesSpawned: this.enemiesSpawned,
      levelTimes: { ...this.levelTimes },
      enemiesCount: this.enemies.length,
      xpDropsCount: this.xpDrops.length,
      heartDropsCount: this.heartDrops.length,
      axesCount: this.axes.length
    };
  }
  
  isGameOver() {
    if (this.player.hp <= 0) {
      // Dismiss shop if game is over
      this.showShop = false;
      this.shopOptions = [];
      this.autoShopSelected = false;
      return true;
    }
    return false;
  }
  
  hasReachedLevel(targetLevel) {
    return this.level >= targetLevel;
  }
  
  setAutoPathing(enabled) {
    this.autoPathing = enabled;
  }
  
  selectShopOption(key) {
    const option = this.shopOptions.find(opt => opt.key === key);
    if (option) {
      option.apply();
      this.showShop = false;
      this.shopOptions = [];
    }
  }
  
  autoShop() {
    if (this.shopOptions.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.shopOptions.length);
      const randomOption = this.shopOptions[randomIndex];
      console.log('Auto-shopping:', randomOption.label);
      randomOption.apply();
      this.showShop = false;
      this.shopOptions = [];
      this.autoShopSelected = false;
    }
  }
  
  getShopOptions() {
    return this.shopOptions;
  }
  
  isShopOpen() {
    return this.showShop;
  }
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BulletBuzzGame;
}

// Export for browser
if (typeof window !== 'undefined') {
  window.BulletBuzzGame = BulletBuzzGame;
} 