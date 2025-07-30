const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const os = require('os');

async function takeGameScreenshots() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Create temporary screenshots directory
  const screenshotsDir = path.join(os.tmpdir(), 'bulletbuzz-screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  try {
    // Navigate to the game
    await page.goto('http://localhost:8080');
    
    // Wait for the game to load
    await page.waitForSelector('#gameCanvas', { timeout: 10000 });
    
    // Take initial screenshot
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'game-initial.png'),
      fullPage: true 
    });
    console.log('✅ Initial game screenshot saved');

    // Wait a bit for the game to start
    await page.waitForTimeout(2000);

    // Take screenshot after game has started
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'game-started.png'),
      fullPage: true 
    });
    console.log('✅ Game started screenshot saved');

    // Wait for enemies to spawn
    await page.waitForTimeout(5000);

    // Take screenshot with enemies
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'game-with-enemies.png'),
      fullPage: true 
    });
    console.log('✅ Game with enemies screenshot saved');

    // Test shop functionality by waiting for level up
    console.log('⏳ Waiting for level up to test shop...');
    await page.waitForTimeout(15000);

    // Check if shop is open (use more specific selector)
    const shopVisible = await page.locator('strong:has-text("Shop:")').isVisible();
    if (shopVisible) {
      await page.screenshot({ 
        path: path.join(screenshotsDir, 'game-shop-open.png'),
        fullPage: true 
      });
      console.log('✅ Shop screenshot saved');
    }

    // Test game over by waiting longer
    console.log('⏳ Waiting for potential game over...');
    await page.waitForTimeout(30000);

    // Check if game over screen is visible
    const gameOverVisible = await page.locator('text=GAME OVER').isVisible();
    if (gameOverVisible) {
      await page.screenshot({ 
        path: path.join(screenshotsDir, 'game-over.png'),
        fullPage: true 
      });
      console.log('✅ Game over screenshot saved');
    }

    // Take final screenshot
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'game-final.png'),
      fullPage: true 
    });
    console.log('✅ Final game screenshot saved');

    console.log(`📁 Screenshots saved to: ${screenshotsDir}`);

  } catch (error) {
    console.error('❌ Error taking screenshots:', error);
  } finally {
    await browser.close();
  }
}

async function takeScreenshotWithSpeed(speed = 10) {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Create temporary screenshots directory
  const screenshotsDir = path.join(os.tmpdir(), 'bulletbuzz-screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  try {
    // Navigate to the game with speed parameter
    await page.goto(`http://localhost:8080/?speed=${speed}`);
    
    // Wait for the game to load
    await page.waitForSelector('#gameCanvas', { timeout: 10000 });
    
    // Wait for game to progress with speed
    await page.waitForTimeout(5000);

    // Take screenshot
    await page.screenshot({ 
      path: path.join(screenshotsDir, `game-speed-${speed}x.png`),
      fullPage: true 
    });
    console.log(`✅ Game at ${speed}x speed screenshot saved`);

  } catch (error) {
    console.error('❌ Error taking speed screenshot:', error);
  } finally {
    await browser.close();
  }
}

// Clean up temporary screenshots directory
function cleanupScreenshots() {
  const screenshotsDir = path.join(os.tmpdir(), 'bulletbuzz-screenshots');
  if (fs.existsSync(screenshotsDir)) {
    fs.rmSync(screenshotsDir, { recursive: true, force: true });
    console.log('🧹 Cleaned up temporary screenshots directory');
  }
}

// Run the screenshot tests
async function main() {
  console.log('📸 Starting screenshot tests...');
  
  // Start the development server if not running
  console.log('🚀 Make sure the development server is running: npm run dev');
  
  // Clean up any existing screenshots
  cleanupScreenshots();
  
  await takeGameScreenshots();
  await takeScreenshotWithSpeed(10);
  
  console.log('🎉 Screenshot tests completed!');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { takeGameScreenshots, takeScreenshotWithSpeed, cleanupScreenshots }; 