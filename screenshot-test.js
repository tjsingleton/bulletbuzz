const { chromium } = require('playwright');
const path = require('path');

async function takeGameScreenshots() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to the game
    await page.goto('http://localhost:8080');
    
    // Wait for the game to load
    await page.waitForSelector('#gameCanvas', { timeout: 10000 });
    
    // Take initial screenshot
    await page.screenshot({ 
      path: 'screenshots/game-initial.png',
      fullPage: true 
    });
    console.log('✅ Initial game screenshot saved');

    // Wait a bit for the game to start
    await page.waitForTimeout(2000);

    // Take screenshot after game has started
    await page.screenshot({ 
      path: 'screenshots/game-started.png',
      fullPage: true 
    });
    console.log('✅ Game started screenshot saved');

    // Wait for enemies to spawn
    await page.waitForTimeout(5000);

    // Take screenshot with enemies
    await page.screenshot({ 
      path: 'screenshots/game-with-enemies.png',
      fullPage: true 
    });
    console.log('✅ Game with enemies screenshot saved');

    // Test shop functionality by waiting for level up
    console.log('⏳ Waiting for level up to test shop...');
    await page.waitForTimeout(15000);

    // Check if shop is open
    const shopVisible = await page.locator('text=SHOP').isVisible();
    if (shopVisible) {
      await page.screenshot({ 
        path: 'screenshots/game-shop-open.png',
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
        path: 'screenshots/game-over.png',
        fullPage: true 
      });
      console.log('✅ Game over screenshot saved');
    }

    // Take final screenshot
    await page.screenshot({ 
      path: 'screenshots/game-final.png',
      fullPage: true 
    });
    console.log('✅ Final game screenshot saved');

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

  try {
    // Navigate to the game with speed parameter
    await page.goto(`http://localhost:8080/?speed=${speed}`);
    
    // Wait for the game to load
    await page.waitForSelector('#gameCanvas', { timeout: 10000 });
    
    // Wait for game to progress with speed
    await page.waitForTimeout(5000);

    // Take screenshot
    await page.screenshot({ 
      path: `screenshots/game-speed-${speed}x.png`,
      fullPage: true 
    });
    console.log(`✅ Game at ${speed}x speed screenshot saved`);

  } catch (error) {
    console.error('❌ Error taking speed screenshot:', error);
  } finally {
    await browser.close();
  }
}

// Create screenshots directory if it doesn't exist
const fs = require('fs');
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir);
}

// Run the screenshot tests
async function main() {
  console.log('📸 Starting screenshot tests...');
  
  // Start the development server if not running
  console.log('🚀 Make sure the development server is running: npm run dev');
  
  await takeGameScreenshots();
  await takeScreenshotWithSpeed(10);
  
  console.log('🎉 Screenshot tests completed!');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { takeGameScreenshots, takeScreenshotWithSpeed }; 