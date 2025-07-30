const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

class GameScreenshotTaker {
  constructor() {
    this.browser = null;
    this.page = null;
    this.screenshotsDir = path.join(__dirname, 'screenshots');
    
    // Create screenshots directory if it doesn't exist
    if (!fs.existsSync(this.screenshotsDir)) {
      fs.mkdirSync(this.screenshotsDir);
    }
  }

  async init() {
    this.browser = await chromium.launch({ 
      headless: false,
      slowMo: 100 // Slow down actions for better visibility
    });
    const context = await this.browser.newContext({
      viewport: { width: 1200, height: 800 }
    });
    this.page = await context.newPage();
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async takeScreenshot(name, options = {}) {
    const filename = `${name}-${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
    const filepath = path.join(this.screenshotsDir, filename);
    
    await this.page.screenshot({ 
      path: filepath,
      fullPage: true,
      ...options
    });
    
    console.log(`✅ Screenshot saved: ${filename}`);
    return filepath;
  }

  async captureGameStates() {
    try {
      await this.init();
      
      // Navigate to game
      await this.page.goto('http://localhost:8080');
      await this.page.waitForSelector('#gameCanvas', { timeout: 10000 });
      
      // Initial state
      await this.takeScreenshot('01-initial-load');
      
      // Wait for game to start
      await this.page.waitForTimeout(2000);
      await this.takeScreenshot('02-game-started');
      
      // Wait for enemies
      await this.page.waitForTimeout(5000);
      await this.takeScreenshot('03-with-enemies');
      
      // Test auto-shop functionality
      console.log('⏳ Testing auto-shop...');
      await this.page.waitForTimeout(10000);
      
      const shopVisible = await this.page.locator('text=SHOP').isVisible();
      if (shopVisible) {
        await this.takeScreenshot('04-shop-open');
        
        // Wait for auto-shop to select option
        await this.page.waitForTimeout(2000);
        await this.takeScreenshot('05-shop-closed');
      }
      
      // Test game over
      console.log('⏳ Waiting for game over...');
      await this.page.waitForTimeout(20000);
      
      const gameOverVisible = await this.page.locator('text=GAME OVER').isVisible();
      if (gameOverVisible) {
        await this.takeScreenshot('06-game-over');
      }
      
      // Final state
      await this.takeScreenshot('07-final-state');
      
    } catch (error) {
      console.error('❌ Error capturing game states:', error);
    } finally {
      await this.close();
    }
  }

  async captureSpeedTest(speed = 10) {
    try {
      await this.init();
      
      // Navigate with speed parameter
      await this.page.goto(`http://localhost:8080/?speed=${speed}`);
      await this.page.waitForSelector('#gameCanvas', { timeout: 10000 });
      
      // Wait for game to progress
      await this.page.waitForTimeout(3000);
      await this.takeScreenshot(`speed-${speed}x`);
      
    } catch (error) {
      console.error('❌ Error capturing speed test:', error);
    } finally {
      await this.close();
    }
  }

  async captureUIElements() {
    try {
      await this.init();
      
      await this.page.goto('http://localhost:8080');
      await this.page.waitForSelector('#gameCanvas', { timeout: 10000 });
      
      // Capture different UI states
      await this.takeScreenshot('ui-initial');
      
      // Test pause functionality
      await this.page.keyboard.press('P');
      await this.page.waitForTimeout(1000);
      await this.takeScreenshot('ui-paused');
      
      // Resume
      await this.page.keyboard.press('P');
      await this.page.waitForTimeout(1000);
      await this.takeScreenshot('ui-resumed');
      
      // Test auto-pathing toggle
      const autoPathCheckbox = this.page.locator('#autoPath');
      await autoPathCheckbox.click();
      await this.page.waitForTimeout(1000);
      await this.takeScreenshot('ui-auto-path-disabled');
      
      // Re-enable
      await autoPathCheckbox.click();
      await this.page.waitForTimeout(1000);
      await this.takeScreenshot('ui-auto-path-enabled');
      
    } catch (error) {
      console.error('❌ Error capturing UI elements:', error);
    } finally {
      await this.close();
    }
  }

  async captureGameOverDetails() {
    try {
      await this.init();
      
      // Use high speed to reach game over quickly
      await this.page.goto('http://localhost:8080/?speed=20');
      await this.page.waitForSelector('#gameCanvas', { timeout: 10000 });
      
      // Wait for game over
      console.log('⏳ Waiting for game over with high speed...');
      await this.page.waitForTimeout(15000);
      
      // Check for game over screen
      const gameOverVisible = await this.page.locator('text=GAME OVER').isVisible();
      if (gameOverVisible) {
        await this.takeScreenshot('game-over-detailed');
        
        // Capture specific statistics
        const stats = await this.page.locator('text=Survival Time').isVisible();
        if (stats) {
          await this.takeScreenshot('game-over-stats');
        }
      }
      
    } catch (error) {
      console.error('❌ Error capturing game over details:', error);
    } finally {
      await this.close();
    }
  }
}

// Main execution
async function main() {
  console.log('📸 Starting advanced screenshot tests...');
  console.log('🚀 Make sure the development server is running: npm run dev');
  
  const taker = new GameScreenshotTaker();
  
  // Run different screenshot tests
  await taker.captureGameStates();
  await taker.captureSpeedTest(10);
  await taker.captureUIElements();
  await taker.captureGameOverDetails();
  
  console.log('🎉 Advanced screenshot tests completed!');
  console.log('📁 Check the screenshots directory for results');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = GameScreenshotTaker; 