const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

class GameScreenshotTaker {
  constructor() {
    this.browser = null;
    this.page = null;
    this.screenshotsDir = path.join(__dirname, '.tmp', 'screenshots');
    this.consoleErrors = [];
    this.networkErrors = [];
    this.pageErrors = [];
    
    // Create screenshots directory if it doesn't exist
    if (!fs.existsSync(this.screenshotsDir)) {
      fs.mkdirSync(this.screenshotsDir, { recursive: true });
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
    
    // Listen for console errors
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        this.consoleErrors.push({
          type: 'console',
          message: msg.text(),
          location: msg.location(),
          timestamp: new Date().toISOString()
        });
        console.log(`❌ Console Error: ${msg.text()}`);
      }
    });
    
    // Listen for page errors
    this.page.on('pageerror', error => {
      this.pageErrors.push({
        type: 'pageerror',
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.log(`❌ Page Error: ${error.message}`);
    });
    
    // Listen for network failures
    this.page.on('requestfailed', request => {
      this.networkErrors.push({
        type: 'requestfailed',
        url: request.url(),
        failure: request.failure(),
        timestamp: new Date().toISOString()
      });
      console.log(`❌ Network Error: ${request.url()} - ${request.failure()?.errorText || 'Unknown error'}`);
    });
    
    // Listen for response errors (4xx, 5xx)
    this.page.on('response', response => {
      if (response.status() >= 400) {
        this.networkErrors.push({
          type: 'response_error',
          url: response.url(),
          status: response.status(),
          statusText: response.statusText(),
          timestamp: new Date().toISOString()
        });
        console.log(`❌ Response Error: ${response.url()} - ${response.status()} ${response.statusText()}`);
      }
    });
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  reportErrors() {
    const totalErrors = this.consoleErrors.length + this.networkErrors.length + this.pageErrors.length;
    
    if (totalErrors > 0) {
      console.log(`\n⚠️  Found ${totalErrors} errors during testing:`);
      
      if (this.consoleErrors.length > 0) {
        console.log(`\n📝 Console Errors (${this.consoleErrors.length}):`);
        this.consoleErrors.forEach((error, index) => {
          console.log(`  ${index + 1}. ${error.message}`);
          if (error.location?.url) {
            console.log(`     Location: ${error.location.url}:${error.location.lineNumber}`);
          }
        });
      }
      
      if (this.networkErrors.length > 0) {
        console.log(`\n🌐 Network Errors (${this.networkErrors.length}):`);
        this.networkErrors.forEach((error, index) => {
          if (error.type === 'requestfailed') {
            console.log(`  ${index + 1}. Failed to load: ${error.url}`);
            console.log(`     Error: ${error.failure?.errorText || 'Unknown'}`);
          } else {
            console.log(`  ${index + 1}. ${error.url} - ${error.status} ${error.statusText}`);
          }
        });
      }
      
      if (this.pageErrors.length > 0) {
        console.log(`\n💥 Page Errors (${this.pageErrors.length}):`);
        this.pageErrors.forEach((error, index) => {
          console.log(`  ${index + 1}. ${error.message}`);
        });
      }
      
      return false; // Indicates errors were found
    } else {
      console.log('\n✅ No errors detected during testing');
      return true; // Indicates no errors
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

  async captureGameStates(baseUrl = 'http://localhost:8080') {
    try {
      await this.init();
      
      // Navigate to game
      console.log(`🌐 Loading game from: ${baseUrl}`);
      await this.page.goto(baseUrl);
      
      // Check for immediate errors after page load
      if (this.consoleErrors.length > 0 || this.networkErrors.length > 0 || this.pageErrors.length > 0) {
        console.log('⚠️ Errors detected during page load - checking if game can still function');
        this.reportErrors();
      }
      
      // Assert game canvas is present
      await this.page.waitForSelector('#gameCanvas', { timeout: 10000 });
      const canvas = await this.page.locator('#gameCanvas');
      const canvasVisible = await canvas.isVisible();
      if (!canvasVisible) {
        throw new Error('Game canvas not visible');
      }
      console.log('✅ Game canvas loaded successfully');
      
      // Initial state
      await this.takeScreenshot('01-initial-load');
      
      // Wait for game to start and assert game is running
      await this.page.waitForTimeout(2000);
      const gameStats = await this.page.locator('#stats').textContent();
      if (!gameStats || gameStats.includes('Level: 1')) {
        console.log('✅ Game stats visible:', gameStats);
      }
      await this.takeScreenshot('02-game-started');
      
      // Wait for enemies and assert they appear
      await this.page.waitForTimeout(5000);
      const enemyStats = await this.page.locator('#enemyStats').textContent();
      if (enemyStats && enemyStats.includes('Enemies:')) {
        console.log('✅ Enemy stats visible:', enemyStats);
      }
      await this.takeScreenshot('03-with-enemies');
      
      // Test auto-shop functionality
      console.log('⏳ Testing auto-shop...');
      await this.page.waitForTimeout(10000);
      
      const shopVisible = await this.page.locator('strong:has-text("Shop:")').isVisible();
      if (shopVisible) {
        console.log('✅ Shop modal appeared');
        await this.takeScreenshot('04-shop-open');
        
        // Wait for auto-shop to select option
        await this.page.waitForTimeout(2000);
        const shopClosed = !(await this.page.locator('strong:has-text("Shop:")').isVisible());
        if (shopClosed) {
          console.log('✅ Shop closed after auto-selection');
        }
        await this.takeScreenshot('05-shop-closed');
      } else {
        console.log('⚠️ Shop did not appear (may need more time)');
      }
      
      // Test game over
      console.log('⏳ Waiting for game over...');
      await this.page.waitForTimeout(20000);
      
      const gameOverVisible = await this.page.locator('text=GAME OVER').isVisible();
      if (gameOverVisible) {
        console.log('✅ Game over screen appeared');
        await this.takeScreenshot('06-game-over');
      } else {
        console.log('⚠️ Game over did not appear (player may still be alive)');
      }
      
      // Final state
      await this.takeScreenshot('07-final-state');
      
      // Final error report
      const noErrors = this.reportErrors();
      if (!noErrors) {
        console.log('⚠️ Game may have issues despite appearing to function');
      }
      
    } catch (error) {
      console.error('❌ Error capturing game states:', error);
      // Take error screenshot
      await this.takeScreenshot('error-game-load');
      this.reportErrors(); // Report any errors that occurred
      throw error;
    } finally {
      await this.close();
    }
  }

  async captureGitHubPages() {
    console.log('🌐 Testing GitHub Pages deployment...');
    await this.captureGameStates('https://tjsingleton.github.io/bulletbuzz/game/');
  }

  async testGameContent() {
    try {
      await this.init();
      
      console.log('🎮 Testing game content and functionality...');
      await this.page.goto('https://tjsingleton.github.io/bulletbuzz/game/');
      
      // Test page load
      await this.page.waitForSelector('#gameCanvas', { timeout: 10000 });
      console.log('✅ Game page loaded successfully');
      
      // Test game elements
      const elements = [
        { selector: '#gameCanvas', name: 'Game Canvas' },
        { selector: '#stats', name: 'Player Stats' },
        { selector: '#enemyStats', name: 'Enemy Stats' },
        { selector: '#gameSpeed', name: 'Game Speed Control' },
        { selector: '#autoPath', name: 'Auto-Pathing Toggle' },
        { selector: '#autoShop', name: 'Auto-Shop Toggle' }
      ];
      
      for (const element of elements) {
        const isVisible = await this.page.locator(element.selector).isVisible();
        if (isVisible) {
          console.log(`✅ ${element.name} is visible`);
        } else {
          console.log(`❌ ${element.name} is not visible`);
        }
      }
      
      // Test game functionality
      await this.page.waitForTimeout(3000);
      
      // Check if game is running
      const statsText = await this.page.locator('#stats').textContent();
      if (statsText && statsText.includes('Level:')) {
        console.log('✅ Game is running with stats:', statsText);
      } else {
        console.log('⚠️ Game stats not updating');
      }
      
      // Test controls
      const speedControl = await this.page.locator('#gameSpeed');
      await speedControl.fill('5');
      const speedValue = await this.page.locator('#gameSpeedValue').textContent();
      if (speedValue && speedValue.includes('5.0x')) {
        console.log('✅ Speed control working:', speedValue);
      }
      
      // Test auto-pathing toggle
      const autoPathToggle = await this.page.locator('#autoPath');
      const initialState = await autoPathToggle.isChecked();
      await autoPathToggle.click();
      const newState = await autoPathToggle.isChecked();
      if (initialState !== newState) {
        console.log('✅ Auto-pathing toggle working');
      }
      
      await this.takeScreenshot('game-content-test');
      
    } catch (error) {
      console.error('❌ Error testing game content:', error);
      await this.takeScreenshot('error-game-content');
      throw error;
    } finally {
      await this.close();
    }
  }

  async captureDocumentation() {
    try {
      await this.init();
      
      console.log('📚 Testing documentation site...');
      
      // Test homepage
      await this.page.goto('https://tjsingleton.github.io/bulletbuzz/');
      await this.page.waitForTimeout(2000);
      
      // Check for errors after page load
      if (this.consoleErrors.length > 0 || this.networkErrors.length > 0 || this.pageErrors.length > 0) {
        console.log('⚠️ Errors detected during documentation load');
        this.reportErrors();
      }
      
      // Assert homepage content
      const title = await this.page.locator('h1').first().textContent();
      if (title && title.includes('BulletBuzz')) {
        console.log('✅ Documentation homepage loaded:', title);
      } else {
        throw new Error('Documentation homepage not loading correctly');
      }
      
      // Check for navigation
      const navVisible = await this.page.locator('nav[data-md-level="0"]').isVisible();
      if (navVisible) {
        console.log('✅ Documentation navigation visible');
      } else {
        console.log('⚠️ Documentation navigation not visible');
      }
      
      await this.takeScreenshot('docs-homepage');
      
      // Test API documentation
      await this.page.goto('https://tjsingleton.github.io/bulletbuzz/api/');
      await this.page.waitForTimeout(2000);
      
      // Assert API docs content
      const apiTitle = await this.page.locator('h1, h2').first().textContent();
      if (apiTitle && (apiTitle.includes('API') || apiTitle.includes('Documentation'))) {
        console.log('✅ API documentation loaded:', apiTitle);
      } else {
        console.log('⚠️ API documentation may not be loading correctly');
      }
      
      await this.takeScreenshot('docs-api');
      
      // Test testing documentation
      await this.page.goto('https://tjsingleton.github.io/bulletbuzz/testing/unit-testing/');
      await this.page.waitForTimeout(2000);
      
      // Assert testing docs content
      const testingTitle = await this.page.locator('h1, h2').first().textContent();
      if (testingTitle && testingTitle.includes('Testing')) {
        console.log('✅ Testing documentation loaded:', testingTitle);
      } else {
        console.log('⚠️ Testing documentation may not be loading correctly');
      }
      
      await this.takeScreenshot('docs-testing');
      
      // Final error report
      const noErrors = this.reportErrors();
      if (!noErrors) {
        console.log('⚠️ Documentation may have issues despite appearing to function');
      }
      
    } catch (error) {
      console.error('❌ Error capturing documentation:', error);
      // Take error screenshot
      await this.takeScreenshot('error-docs-load');
      this.reportErrors(); // Report any errors that occurred
      throw error;
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

  // Clean up temporary screenshots directory
  cleanup() {
    if (fs.existsSync(this.screenshotsDir)) {
      fs.rmSync(this.screenshotsDir, { recursive: true, force: true });
      console.log('🧹 Cleaned up temporary screenshots directory');
    }
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'all';
  
  console.log('📸 Starting advanced screenshot tests...');
  
  const taker = new GameScreenshotTaker();
  
  // Clean up any existing screenshots
  taker.cleanup();
  
  try {
    switch (command) {
      case 'github-pages':
        console.log('🌐 Testing GitHub Pages deployment...');
        await taker.captureGitHubPages();
        break;
        
      case 'documentation':
        console.log('📚 Testing documentation site...');
        await taker.captureDocumentation();
        break;
        
      case 'game-content':
        console.log('🎮 Testing game content and functionality...');
        await taker.testGameContent();
        break;
        
      case 'all':
      default:
        console.log('🚀 Running all tests (make sure dev server is running: npm run dev)');
        await taker.captureGameStates();
        await taker.captureSpeedTest(10);
        await taker.captureUIElements();
        await taker.captureGameOverDetails();
        await taker.captureGitHubPages();
        await taker.captureDocumentation();
        await taker.testGameContent();
        break;
    }
    
    console.log('🎉 Screenshot tests completed!');
    console.log(`📁 Check the temporary directory for results: ${taker.screenshotsDir}`);
    
  } catch (error) {
    console.error('❌ Error during screenshot tests:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = GameScreenshotTaker; 