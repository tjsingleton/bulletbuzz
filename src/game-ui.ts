// Game UI Logic
// Handles rendering, input, and UI updates for the BulletBuzz game

import { BulletBuzzGame } from './BulletBuzzGame.js';

// Global variables
let game: BulletBuzzGame | null = null;
let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let backgroundCanvas: HTMLCanvasElement | null = null;
let keys: Record<string, boolean> = {};
let paused: boolean = false;
let gameStatePrinted: boolean = false;
let autoShopTimer: number | null = null;
let gameSpeed: number = 1.0;

// Mobile control variables
let joystickActive: boolean = false;
let joystickCenter: { x: number; y: number } = { x: 0, y: 0 };
let joystickMaxDistance: number = 40;
let touchMovement: { x: number; y: number } = { x: 0, y: 0 };

// Get game speed from URL parameters
function getGameSpeedFromURL(): number {
  const urlParams = new URLSearchParams(window.location.search);
  const speedParam = urlParams.get('speed');
  if (speedParam) {
    const speed = parseFloat(speedParam);
    if (!isNaN(speed) && speed > 0) {
      return speed;
    }
  }
  return 1.0; // Default speed
}

// Initialize game UI
function initGameUI(): void {
  // Set game speed from URL parameter
  gameSpeed = getGameSpeedFromURL();
  
  // Log if game speed was set from URL
  if (gameSpeed !== 1.0) {
    console.log(`🎮 Game speed set to ${gameSpeed}x from URL parameter`);
  }
  
  canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  if (!canvas) {
    console.error("Canvas element not found!");
    return;
  }
  
  ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Could not get 2D context!");
    return;
  }
  
  // Create background
  createBackgroundCanvas();
  
  // Initialize game with default config
  const config = {
    startHp: 10,
    pickupRange: 25,
    playerSpeed: 0.85,
    enemySpeed: 0.15,
    spawnInterval: 8000,
    heartDropRate: 0.20,
    avoidDistance: 120,
    avoidStrength: 2.0,
    singleEnemyLevel: 6,
    minSpawnInterval: 4500
  };
  
  // Get canvas dimensions for game initialization
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  
  game = new BulletBuzzGame(config);
  
  // Update game canvas dimensions to match the actual canvas
  game.canvasWidth = canvasWidth;
  game.canvasHeight = canvasHeight;
  
  // Start game loop
  requestAnimationFrame(gameLoop);
  
  // Set up event listeners
  setupEventListeners();
  
  // Initialize mobile controls
  setupMobileControls();
  
  // Initialize UI elements
  const speedValueDisplay = document.getElementById("gameSpeedValue");
  if (speedValueDisplay) {
    speedValueDisplay.textContent = gameSpeed.toFixed(1) + "x";
  }
  
  // Initialize game speed slider
  const gameSpeedSlider = document.getElementById("gameSpeed") as HTMLInputElement;
  if (gameSpeedSlider) {
    gameSpeedSlider.value = gameSpeed.toString();
  }
  
  // Initialize auto-pathing checkbox
  const autoPathCheckbox = document.getElementById("autoPath") as HTMLInputElement;
  if (autoPathCheckbox) {
    autoPathCheckbox.checked = true; // Start with auto-pathing enabled
  }
}

// Set up mobile controls
function setupMobileControls(): void {
  const joystickBase = document.getElementById("joystickBase");
  const joystickThumb = document.getElementById("joystickThumb");
  const pauseButton = document.getElementById("pauseButton");
  const resetButton = document.getElementById("resetButton");
  
  if (!joystickBase || !joystickThumb || !pauseButton || !resetButton) {
    console.warn("Mobile control elements not found");
    return;
  }
  
  // Initialize joystick center position
  const rect = joystickBase.getBoundingClientRect();
  joystickCenter.x = rect.left + rect.width / 2;
  joystickCenter.y = rect.top + rect.height / 2;
  
  // Joystick touch events
  joystickBase.addEventListener('touchstart', handleJoystickStart);
  joystickBase.addEventListener('touchmove', handleJoystickMove);
  joystickBase.addEventListener('touchend', handleJoystickEnd);
  
  // Action button events
  pauseButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    togglePause();
  });
  
  resetButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    resetGame();
  });
  
  // Prevent default touch behaviors
  joystickBase.addEventListener('touchstart', (e) => e.preventDefault());
  joystickBase.addEventListener('touchmove', (e) => e.preventDefault());
  pauseButton.addEventListener('touchstart', (e) => e.preventDefault());
  resetButton.addEventListener('touchstart', (e) => e.preventDefault());
}

// Handle joystick touch start
function handleJoystickStart(e: TouchEvent): void {
  e.preventDefault();
  joystickActive = true;
  updateJoystickPosition(e.touches[0]);
}

// Handle joystick touch move
function handleJoystickMove(e: TouchEvent): void {
  e.preventDefault();
  if (joystickActive) {
    updateJoystickPosition(e.touches[0]);
  }
}

// Handle joystick touch end
function handleJoystickEnd(e: TouchEvent): void {
  e.preventDefault();
  joystickActive = false;
  resetJoystick();
}

// Update joystick position
function updateJoystickPosition(touch: Touch): void {
  const joystickThumb = document.getElementById("joystickThumb");
  if (!joystickThumb) return;
  
  // Calculate distance from center
  const dx = touch.clientX - joystickCenter.x;
  const dy = touch.clientY - joystickCenter.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Limit to max distance
  const limitedDistance = Math.min(distance, joystickMaxDistance);
  const angle = Math.atan2(dy, dx);
  
  // Calculate new position
  const newX = joystickCenter.x + limitedDistance * Math.cos(angle);
  const newY = joystickCenter.y + limitedDistance * Math.sin(angle);
  
  // Update thumb position
  joystickThumb.style.left = `${newX - joystickCenter.x + 60}px`;
  joystickThumb.style.top = `${newY - joystickCenter.y + 60}px`;
  
  // Calculate normalized movement values (-1 to 1)
  if (distance > 0) {
    touchMovement.x = (dx / distance) * (limitedDistance / joystickMaxDistance);
    touchMovement.y = (dy / distance) * (limitedDistance / joystickMaxDistance);
  } else {
    touchMovement.x = 0;
    touchMovement.y = 0;
  }
}

// Reset joystick to center
function resetJoystick(): void {
  const joystickThumb = document.getElementById("joystickThumb");
  if (joystickThumb) {
    joystickThumb.style.left = '60px';
    joystickThumb.style.top = '60px';
  }
  touchMovement.x = 0;
  touchMovement.y = 0;
}

// Set up event listeners
function setupEventListeners(): void {
  if (!canvas) return;
  
  // Keyboard events
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    keys[e.key] = true;
    
    // Handle special keys
    if (e.key === 'p' || e.key === 'P') {
      togglePause();
    }
    if (e.key === 'r' || e.key === 'R') {
      resetGame();
    }
    if (e.key === '1' || e.key === '2' || e.key === '3' || e.key === '4' || e.key === '5') {
      if (game && game.isShopOpen()) {
        game.selectShopOption(e.key);
      }
    }
  });
  
  document.addEventListener('keyup', (e: KeyboardEvent) => {
    keys[e.key] = false;
  });
  
  // Mouse events
  canvas.addEventListener('click', (e: MouseEvent) => {
    const rect = canvas!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Handle shop clicks
    if (game && game.isShopOpen()) {
      handleShopClick(x, y);
    }
    
    // Handle game over clicks
    if (game && game.isGameOver()) {
      handleGameOverClick(x, y);
    }
  });
  
  // Game speed slider
  const gameSpeedSlider = document.getElementById("gameSpeed") as HTMLInputElement;
  const speedValueDisplay = document.getElementById("gameSpeedValue");
  
  if (gameSpeedSlider && speedValueDisplay) {
    gameSpeedSlider.addEventListener("input", function() {
      const speed = parseFloat(this.value);
      gameSpeed = speed;
      speedValueDisplay!.textContent = speed.toFixed(1) + "x";
    });
  }
  
  // Auto-pathing checkbox
  const autoPathCheckbox = document.getElementById("autoPath") as HTMLInputElement;
  if (autoPathCheckbox) {
    autoPathCheckbox.addEventListener("change", function() {
      if (game) {
        game.setAutoPathing(this.checked);
      }
    });
  }
  
  // Auto-shop checkbox
  const autoShopCheckbox = document.getElementById("autoShop") as HTMLInputElement;
  if (autoShopCheckbox) {
    autoShopCheckbox.addEventListener("change", function() {
      // Auto-shop setting will be used when shop opens
    });
  }
}

// Main game loop
function gameLoop(): void {
  if (!game || game.isGameOver()) {
    if (game && game.isGameOver() && !gameStatePrinted) {
      printGameState();
      gameStatePrinted = true;
    }
    return;
  }
  
  // Handle manual player movement
  handlePlayerMovement();
  
  // Step the game with speed multiplier
  game.step((1/60) * gameSpeed);
  
  // Update UI
  updateStats();
  
  // Draw everything
  draw();
  
  // Continue loop
  if (!paused) {
    requestAnimationFrame(gameLoop);
  }
}

// Handle manual player movement
function handlePlayerMovement(): void {
  if (!game) return;
  
  // Check if auto-pathing is disabled
  const autoPathCheckbox = document.getElementById("autoPath") as HTMLInputElement;
  if (autoPathCheckbox && autoPathCheckbox.checked) {
    return; // Auto-pathing is enabled, don't handle manual movement
  }
  
  // Get player from game state
  const gameState = game.getGameState();
  const player = gameState.player;
  
  // Calculate movement speed
  const moveSpeed = player.speed * gameSpeed;
  let dx = 0, dy = 0;
  
  // Check keyboard movement keys
  if (keys['ArrowUp'] || keys['w'] || keys['W']) dy -= moveSpeed;
  if (keys['ArrowDown'] || keys['s'] || keys['S']) dy += moveSpeed;
  if (keys['ArrowLeft'] || keys['a'] || keys['A']) dx -= moveSpeed;
  if (keys['ArrowRight'] || keys['d'] || keys['D']) dx += moveSpeed;
  
  // Check touch movement (mobile controls)
  if (joystickActive && (touchMovement.x !== 0 || touchMovement.y !== 0)) {
    dx += touchMovement.x * moveSpeed;
    dy += touchMovement.y * moveSpeed;
  }
  
  // Apply diagonal movement normalization
  if (dx !== 0 && dy !== 0) {
    dx *= 0.707; // 1/√2 for diagonal movement
    dy *= 0.707;
  }
  
  // Apply movement to player
  if (dx !== 0 || dy !== 0) {
    // Access the internal game instance to update player position
    const internalGame = (game as any).game;
    if (internalGame && internalGame.player) {
      // Update player position with boundary checks
      const newX = Math.max(20, Math.min(canvas!.width - 20, internalGame.player.x + dx));
      const newY = Math.max(20, Math.min(canvas!.height - 20, internalGame.player.y + dy));
      
      internalGame.player.x = newX;
      internalGame.player.y = newY;
    }
  }
}

// Draw function
function draw(): void {
  if (!game || !ctx || !canvas) return;
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw background
  if (backgroundCanvas) {
    ctx.drawImage(backgroundCanvas, 0, 0);
  }
  
  // Get game state for rendering
  const gameState = game.getGameState();
  
  // Draw player
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = gameState.player.hitTimer > 0 ? 'red' : 'yellow';
  ctx.fillText('🧑‍🌾', gameState.player.x, gameState.player.y);
  
  // Draw flee range
  ctx.beginPath();
  ctx.setLineDash([2, 2]);
  ctx.strokeStyle = 'rgba(255, 255, 0, 0.3)';
  ctx.arc(gameState.player.x, gameState.player.y, 80, 0, Math.PI * 2); // Use fixed flee range
  ctx.stroke();
  
  // Draw attack range
  ctx.beginPath();
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = 'rgba(255, 0, 0, 0.6)'; // Increased opacity for visibility
  ctx.lineWidth = 2; // Make line thicker
  ctx.arc(gameState.player.x, gameState.player.y, gameState.player.attackRange, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 1; // Reset line width
  
  // Draw pickup range
  ctx.beginPath();
  ctx.setLineDash([3, 3]);
  ctx.strokeStyle = 'rgba(0, 255, 255, 0.4)'; // Cyan with opacity
  ctx.lineWidth = 1;
  ctx.arc(gameState.player.x, gameState.player.y, gameState.player.pickupRange, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.lineWidth = 1;
  
  // Draw enemies - access through the game's internal Game instance
  ctx.font = '24px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  (game as any).game.enemies.forEach((e: any) => {
    const emoji = '🐝'; // Use bee emoji for all enemies
    ctx!.fillText(emoji, e.x, e.y);
  });
  
  // Draw XP drops
  ctx.font = '12px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  (game as any).game.xpDrops.forEach((xp: any) => {
    ctx!.fillText('🟢', xp.x, xp.y);
  });
  
  // Draw heart drops
  ctx.font = '16px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  (game as any).game.heartDrops.forEach((h: any) => {
    // Calculate fade based on lifetime (fade over 15 seconds)
    const fadeAlpha = Math.max(0.2, 1 - (h.lifetime / 900)); // 15 seconds at 60 FPS
    ctx!.fillStyle = `rgba(255, 0, 0, ${fadeAlpha})`;
    ctx!.fillText('❤️', h.x, h.y);
  });
  
  // Draw axes (projectiles)
  ctx.font = '20px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  (game as any).game.axes.forEach((axe: any) => {
    ctx!.save();
    ctx!.translate(axe.x, axe.y);
    // Calculate rotation based on velocity
    const rotation = Math.atan2(axe.velocityY, axe.velocityX);
    ctx!.rotate(rotation);
    ctx!.fillStyle = 'white';
    ctx!.fillText('🪓', 0, 0);
    ctx!.restore();
  });
  
  // Draw HP bar
  const hpBarWidth = 200;
  const hpBarHeight = 15;
  const hpBarX = 10;
  const hpBarY = 10;
  const hpPercentage = Math.max(0, gameState.player.hp) / gameState.player.maxHp;
  const hpFillWidth = hpPercentage * hpBarWidth;
  
  ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
  ctx.fillRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);
  
  ctx.fillStyle = hpPercentage > 0.5 ? "#ff4444" : hpPercentage > 0.25 ? "#ff8800" : "#ff0000";
  ctx.fillRect(hpBarX, hpBarY, hpFillWidth, hpBarHeight);
  
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.strokeRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);
  
  ctx.fillStyle = "white";
  ctx.font = "14px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`${Math.max(0, Math.floor(gameState.player.hp))}/${gameState.player.maxHp}`, hpBarX + hpBarWidth/2, hpBarY + hpBarHeight/2);
  
  // Draw XP bar
  const xpProgress = (game as any).game.levelSystem.getXpProgress();
  const xpBarWidth = 200;
  const xpBarHeight = 10;
  const xpBarX = 10;
  const xpBarY = 35;
  const xpFillWidth = (xpProgress.current / xpProgress.required) * xpBarWidth;
  
  ctx.fillStyle = "gray";
  ctx.fillRect(xpBarX, xpBarY, xpBarWidth, xpBarHeight);
  
  ctx.fillStyle = "lime";
  ctx.fillRect(xpBarX, xpBarY, xpFillWidth, xpBarHeight);
  
  ctx.strokeStyle = "white";
  ctx.strokeRect(xpBarX, xpBarY, xpBarWidth, xpBarHeight);
  
  ctx.fillStyle = "black";
  ctx.font = "12px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`${xpProgress.current}/${xpProgress.required}`, xpBarX + xpBarWidth/2, xpBarY + xpBarHeight/2);
  
  // Draw timer
  const minutes = Math.floor(gameState.gameTime / 60);
  const seconds = Math.floor(gameState.gameTime % 60);
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  ctx.fillStyle = "white";
  ctx.font = "20px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillText(`Time: ${timeString}`, canvas.width / 2, canvas.height - 20);
  
  // Draw shop if open
  if (game && game.isShopOpen()) {
    drawShop();
  }
  
  // Draw game over screen
  if (game && game.isGameOver()) {
    drawGameOver();
  }
}

// Create background canvas with clean gradient (drawn once)
function createBackgroundCanvas(): void {
  if (!canvas) return;
  
  backgroundCanvas = document.createElement('canvas');
  backgroundCanvas.width = canvas.width;
  backgroundCanvas.height = canvas.height;
  const bgCtx = backgroundCanvas.getContext('2d');
  if (!bgCtx) return;
  
  // Create a subtle gradient background
  const gradient = bgCtx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#1a1a2e');   // Dark blue at top
  gradient.addColorStop(0.5, '#16213e'); // Medium blue in middle
  gradient.addColorStop(1, '#0f3460');   // Darker blue at bottom
  
  bgCtx.fillStyle = gradient;
  bgCtx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add subtle grid pattern
  bgCtx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  bgCtx.lineWidth = 1;
  
  // Vertical lines
  for (let x = 0; x < canvas.width; x += 50) {
    bgCtx.beginPath();
    bgCtx.moveTo(x, 0);
    bgCtx.lineTo(x, canvas.height);
    bgCtx.stroke();
  }
  
  // Horizontal lines
  for (let y = 0; y < canvas.height; y += 50) {
    bgCtx.beginPath();
    bgCtx.moveTo(0, y);
    bgCtx.lineTo(canvas.width, y);
    bgCtx.stroke();
  }
}

// Draw shop
function drawShop(): void {
  if (!game || !ctx || !canvas) return;
  
  const shopOptions = game.getShopOptions();
  
  // Semi-transparent overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Shop panel
  const panelWidth = 450;
  const panelHeight = 280;
  const panelX = (canvas.width - panelWidth) / 2;
  const panelY = (canvas.height - panelHeight) / 2;
  
  // Panel background with gradient effect
  ctx.fillStyle = '#2a2a2a';
  ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 2;
  ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);
  
  // Title with better padding
  ctx.fillStyle = 'white';
  ctx.font = '32px serif';
  ctx.textAlign = 'center';
  ctx.fillText('🏪 SHOP', canvas.width / 2, panelY + 50);
  
  // Subtitle
  ctx.fillStyle = '#ccc';
  ctx.font = '16px serif';
  ctx.fillText('Choose your upgrade:', canvas.width / 2, panelY + 80);
  
  // Options with button-like styling
  ctx.font = '18px serif';
  shopOptions.forEach((option, index) => {
    const optionY = panelY + 110 + index * 45;
    const key = option.key;
    const label = option.label;
    
    // Button background with hover effect
    ctx!.fillStyle = '#444';
    ctx!.fillRect(panelX + 25, optionY - 20, panelWidth - 50, 35);
    
    // Button border
    ctx!.strokeStyle = '#666';
    ctx!.lineWidth = 1;
    ctx!.strokeRect(panelX + 25, optionY - 20, panelWidth - 50, 35);
    
    // Option text with better spacing and vertical centering
    ctx!.fillStyle = 'white';
    ctx!.textAlign = 'left';
    ctx!.textBaseline = 'middle';
    ctx!.fillText(`${key}. ${label}`, panelX + 40, optionY - 2.5);
  });
  
  // Instructions
  ctx.fillStyle = '#aaa';
  ctx.font = '14px serif';
  ctx.textAlign = 'center';
  ctx.fillText('Click an option or press 1-5 to select', canvas.width / 2, panelY + panelHeight - 20);
}

// Draw game over screen
function drawGameOver(): void {
  if (!ctx || !canvas || !game) return;
  
  // Semi-transparent overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Modal panel
  const panelWidth = 500;
  const panelHeight = 400;
  const panelX = (canvas.width - panelWidth) / 2;
  const panelY = (canvas.height - panelHeight) / 2;
  
  // Panel background
  ctx.fillStyle = '#2a2a2a';
  ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 2;
  ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);
  
  // Skull emoji and title
  ctx.fillStyle = 'white';
  ctx.font = '48px serif';
  ctx.textAlign = 'center';
  ctx.fillText('💀 GAME OVER 💀', canvas.width / 2, panelY + 70);
  
  // Game statistics
  const gameState = game.getGameState();
  const minutes = Math.floor(gameState.gameTime / 60);
  const seconds = Math.floor(gameState.gameTime % 60);
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  ctx.font = '18px serif';
  const statsX = panelX + 30;
  const statsWidth = panelWidth - 60;
  let statsY = panelY + 120;
  const lineHeight = 30;
  
  // Helper function to draw a stat line with proper alignment
  const drawStatLine = (emoji: string, label: string, value: string, color: string) => {
    ctx!.fillStyle = color;
    ctx!.textAlign = 'left';
    ctx!.fillText(`${emoji} ${label}`, statsX, statsY);
    
    ctx!.textAlign = 'right';
    ctx!.fillText(value, statsX + statsWidth, statsY);
    
    statsY += lineHeight;
  };
  
  // Game time
  drawStatLine('⏱️', 'Survival Time', timeString, '#FFD700');
  
  // Level reached
  drawStatLine('📈', 'Level Reached', gameState.level.toString(), '#FF6B6B');
  
  // Enemies killed
  drawStatLine('💀', 'Enemies Killed', gameState.enemiesKilled.toString(), '#4ECDC4');
  
  // XP collected
  drawStatLine('⭐', 'XP Collected', gameState.xpCollected.toString(), '#45B7D1');
  
  // Hearts collected
  drawStatLine('❤️', 'Hearts Collected', gameState.heartsCollected.toString(), '#FF69B4');
  
  // Axes thrown
  drawStatLine('🪓', 'Axes Thrown', gameState.axesCount.toString(), '#9B59B6');
  
  // Kill rate
  const killRate = (gameState.enemiesKilled / (gameState.gameTime / 60)).toFixed(2);
  drawStatLine('⚡', 'Kill Rate', `${killRate} kills/min`, '#E74C3C');
  
  // XP efficiency
  const xpEfficiency = (gameState.xpCollected / Math.max(1, gameState.enemiesKilled)).toFixed(2);
  drawStatLine('🎯', 'XP Efficiency', `${xpEfficiency} XP/kill`, '#F39C12');
  
  // Restart button
  const restartButtonY = panelY + panelHeight - 50;
  const restartButtonHeight = 30;
  const restartButtonWidth = 200;
  const restartButtonX = (canvas.width - restartButtonWidth) / 2;
  
  // Button background
  ctx.fillStyle = '#4CAF50';
  ctx.fillRect(restartButtonX, restartButtonY, restartButtonWidth, restartButtonHeight);
  
  // Button border
  ctx.strokeStyle = '#45a049';
  ctx.lineWidth = 2;
  ctx.strokeRect(restartButtonX, restartButtonY, restartButtonWidth, restartButtonHeight);
  
  // Button text
  ctx.fillStyle = 'white';
  ctx.font = '16px serif';
  ctx.textAlign = 'center';
  ctx.fillText('🔄 Restart Game', canvas.width / 2, restartButtonY + 20);
  
  // Additional instruction
  ctx.fillStyle = '#aaa';
  ctx.font = '14px serif';
  ctx.fillText('Or press R key', canvas.width / 2, restartButtonY + restartButtonHeight + 20);
}

// Handle shop click
function handleShopClick(x: number, y: number): void {
  if (!game || !canvas) return;
  
  const shopOptions = game.getShopOptions();
  const panelWidth = 450;
  const panelHeight = 280;
  const panelX = (canvas.width - panelWidth) / 2;
  const panelY = (canvas.height - panelHeight) / 2;
  
  // Check if click is within shop panel
  if (x >= panelX + 25 && x <= panelX + panelWidth - 25) {
    // Check regular shop options
    shopOptions.forEach((option, index) => {
      const optionY = panelY + 110 + index * 45;
      if (y >= optionY - 20 && y <= optionY + 15) {
        game!.selectShopOption(option.key);
      }
    });
  }
}

// Handle game over click
function handleGameOverClick(x: number, y: number): void {
  if (!game || !canvas) return;
  
  const panelWidth = 500;
  const panelHeight = 400;
  const panelX = (canvas.width - panelWidth) / 2;
  const panelY = (canvas.height - panelHeight) / 2;
  
  // Check if click is within the restart button area (bottom of panel)
  const restartButtonY = panelY + panelHeight - 50;
  const restartButtonHeight = 30;
  
  if (x >= panelX && x <= panelX + panelWidth &&
      y >= restartButtonY && y <= restartButtonY + restartButtonHeight) {
    // Restart the game
    resetGame();
  }
}

// Update stats display
function updateStats(): void {
  const statsDiv = document.getElementById("stats");
  const enemyStatsDiv = document.getElementById("enemyStats");
  
  if (game && statsDiv && enemyStatsDiv) {
    const gameState = game.getGameState();
    const xpProgress = (game as any).game.levelSystem.getXpProgress();
    statsDiv.innerText = `Level: ${gameState.level} | XP: ${xpProgress.current}/${xpProgress.required} | HP: ${Math.max(0, Math.floor(gameState.player.hp))}/${gameState.player.maxHp} | Speed: ${gameState.player.speed.toFixed(2)} | Pickup: ${gameState.player.pickupRange} | Attack Range: ${gameState.player.attackRange} | Axes: ${gameState.axesCount}`;
    enemyStatsDiv.innerText = `Enemies: ${gameState.enemiesCount} | Type: 🐝 | HP: 1 | Speed: ${gameState.player.speed} | APS: 1.0`;
    
    // Auto-log performance issues (only when there's a problem)
    const memory = game.getMemoryUsage();
    if (memory.enemies > memory.maxEnemies * 0.9 || 
        memory.xpDrops > memory.maxXpDrops * 0.9 ||
        memory.axes > memory.maxAxes * 0.9) {
      console.warn('⚠️ High memory usage detected:', memory);
    }
  }
}

// Print game state
function printGameState(): void {
  if (!game) return;
  
  const gameState = game.getGameState();
  const minutes = Math.floor(gameState.gameTime / 60);
  const seconds = Math.floor(gameState.gameTime % 60);
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  const xpProgress = (game as any).game.levelSystem.getXpProgress();
  const gameStateText = `=== GAME STATE ===
Time: ${timeString}
Level: ${gameState.level}
Score: ${gameState.score}
Player Speed: ${gameState.player.speed}
Pickup Range: ${gameState.player.pickupRange}
Attack Range: ${gameState.player.attackRange}
Max HP: ${gameState.player.maxHp}
Enemies Killed: ${gameState.enemiesKilled}
XP Collected: ${gameState.xpCollected}
Current XP: ${xpProgress.current}/${xpProgress.required}
Hearts Collected: ${gameState.heartsCollected}
Axes: ${gameState.axesCount}
Enemies Spawned: ${gameState.enemiesSpawned}
XP Efficiency: ${(gameState.xpCollected / Math.max(1, gameState.enemiesKilled)).toFixed(2)} XP per kill
Kill Rate: ${(gameState.enemiesKilled / (gameState.gameTime / 60)).toFixed(2)} kills/min
--- Level Progression ---
${Object.keys(gameState.levelTimes).map(level => `Level ${level}: ${gameState.levelTimes[parseInt(level)]}`).join('\n')}
==================`;
  
  console.log(gameStateText);
  
  const gameStateDiv = document.getElementById("gameState");
  if (gameStateDiv) {
    gameStateDiv.style.display = "block";
    gameStateDiv.innerHTML = `
      <h3>Game State</h3>
      <textarea id="gameStateText" style="width: 100%; height: 200px; font-family: monospace; background: #222; color: white; border: none; padding: 10px;" readonly>${gameStateText}</textarea>
      <br><br>
      <button onclick="copyGameState()" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Copy Game State</button>
    `;
  }
}

// Copy game state
function copyGameState(): void {
  const textarea = document.getElementById("gameStateText") as HTMLTextAreaElement;
  if (textarea) {
    textarea.select();
    textarea.setSelectionRange(0, 99999);
    document.execCommand("copy");
    
    const button = event?.target as HTMLButtonElement;
    if (button) {
      const originalText = button.textContent;
      button.textContent = "Copied!";
      button.style.background = "#45a049";
      setTimeout(() => {
        if (button && originalText) {
          button.textContent = originalText;
          button.style.background = "#4CAF50";
        }
      }, 1000);
    }
  }
}

// Toggle pause
function togglePause(): void {
  paused = !paused;
  if (!paused) {
    requestAnimationFrame(gameLoop);
  }
}

// Reset game
function resetGame(): void {
  if (!game) return;
  
  game.reset();
  gameStatePrinted = false;
  paused = false;
  if (autoShopTimer) {
    clearTimeout(autoShopTimer);
    autoShopTimer = null;
  }
  
  // Clear any displayed game state
  const gameStateDiv = document.getElementById("gameState");
  if (gameStateDiv) {
    gameStateDiv.style.display = "none";
  }
  
  // Restart game loop
  requestAnimationFrame(gameLoop);
}

// Make functions globally available for HTML onclick handlers
declare global {
  interface Window {
    togglePause: typeof togglePause;
    resetGame: typeof resetGame;
    printGameState: typeof printGameState;
    copyGameState: typeof copyGameState;
  }
}

window.togglePause = togglePause;
window.resetGame = resetGame;
window.printGameState = printGameState;
window.copyGameState = copyGameState;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initGameUI); 