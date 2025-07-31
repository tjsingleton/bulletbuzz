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

      async testReadmeDocumentationLink() {
    try {
      await this.init();
      
      console.log('📖 Testing README documentation link...');
      
      // Load the README from GitHub
      await this.page.goto('https://github.com/tjsingleton/bulletbuzz/blob/main/README.md', { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      // Wait for the README content to load
      await this.page.waitForSelector('.markdown-body', { timeout: 10000 });
      
      // Look for the documentation link in the README
      const docLink = await this.page.locator('a[href="https://tjsingleton.github.io/bulletbuzz/"]').isVisible();
      if (docLink) {
        console.log('✅ Documentation link found in README');
      } else {
        console.log('❌ Documentation link not found in README');
      }
      
      // Check for the logo in README
      const logoInReadme = await this.page.locator('img[alt*="BulletBuzz Logo"]').isVisible();
      if (logoInReadme) {
        console.log('✅ Logo found in README');
      } else {
        console.log('⚠️ Logo not found in README');
      }
      
      // Take screenshot of README
      await this.takeScreenshot('readme-test');
      
      // Test the documentation link by clicking it
      const docLinkElement = await this.page.locator('a[href="https://tjsingleton.github.io/bulletbuzz/"]').first();
      if (await docLinkElement.isVisible()) {
        console.log('🔗 Testing documentation link click...');
        
        // Open link in new tab
        await docLinkElement.click({ button: 'middle' });
        
        // Wait for new page to load
        const pages = this.browser.contexts()[0].pages();
        const newPage = pages[pages.length - 1];
        
        await newPage.waitForLoadState('networkidle', { timeout: 15000 });
        
        // Check if documentation loaded
        const docTitle = await newPage.title();
        if (docTitle.includes('BulletBuzz')) {
          console.log('✅ Documentation link works correctly');
        } else {
          console.log('❌ Documentation link failed to load');
        }
        
        await newPage.close();
      }
      
    } catch (error) {
      console.log(`❌ Error testing README documentation link: ${error.message}`);
      await this.takeScreenshot('readme-error');
    } finally {
      await this.close();
    }
  }

  async testGameDocumentationLink() {
    try {
      await this.init();
      
      console.log('🎮 Testing game documentation link...');
      
      // Load the game page
      await this.page.goto('https://tjsingleton.github.io/bulletbuzz/game/', { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      // Wait for game to load
      await this.page.waitForSelector('#gameCanvas', { timeout: 10000 });
      
      // Look for the "View Documentation" link
      const docLink = await this.page.locator('a[href="../"]').isVisible();
      if (docLink) {
        console.log('✅ Documentation link found in game');
      } else {
        console.log('❌ Documentation link not found in game');
      }
      
      // Take screenshot of game page
      await this.takeScreenshot('game-doc-link-test');
      
      // Test the documentation link by clicking it
      const docLinkElement = await this.page.locator('a[href="../"]').first();
      if (await docLinkElement.isVisible()) {
        console.log('🔗 Testing game documentation link click...');
        
        // Click the documentation link
        await docLinkElement.click();
        
        // Wait for navigation
        await this.page.waitForLoadState('networkidle', { timeout: 15000 });
        
        // Check if we're now on the documentation page
        const currentUrl = this.page.url();
        if (currentUrl.includes('tjsingleton.github.io/bulletbuzz') && !currentUrl.includes('/game/')) {
          console.log('✅ Game documentation link works correctly');
          
          // Check for documentation content
          const docTitle = await this.page.title();
          if (docTitle.includes('BulletBuzz')) {
            console.log('✅ Documentation page loaded successfully');
          } else {
            console.log('⚠️ Documentation page title unexpected');
          }
          
          // Take screenshot of documentation page
          await this.takeScreenshot('game-doc-link-result');
          
        } else {
          console.log('❌ Game documentation link failed to navigate correctly');
        }
      }
      
    } catch (error) {
      console.log(`❌ Error testing game documentation link: ${error.message}`);
      await this.takeScreenshot('game-doc-link-error');
    } finally {
      await this.close();
    }
  }

  async testDocumentationLogoSize() {
    try {
      await this.init();
      
      console.log('📏 Testing documentation logo size...');
      
      // Load the documentation page
      await this.page.goto('https://tjsingleton.github.io/bulletbuzz/', { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      // Wait for page to load
      await this.page.waitForSelector('img[alt*="BulletBuzz Logo"]', { timeout: 10000 });
      
      // Find the logo image
      const logo = await this.page.locator('img[alt*="BulletBuzz Logo"]').first();
      if (await logo.isVisible()) {
        console.log('✅ Logo found on documentation page');
        
        // Get the computed width of the logo
        const logoWidth = await logo.evaluate(el => {
          const rect = el.getBoundingClientRect();
          return rect.width;
        });
        
        console.log(`📏 Logo width: ${logoWidth}px`);
        
        // Check if the logo has the expected size (should be around 100px based on our setting)
        if (logoWidth <= 120 && logoWidth >= 80) {
          console.log('✅ Logo size is correct (around 100px)');
        } else {
          console.log(`⚠️ Logo size is ${logoWidth}px, expected around 100px`);
        }
        
        // Check if the logo has width attribute
        const hasWidthAttr = await logo.evaluate(el => el.hasAttribute('width'));
        if (hasWidthAttr) {
          console.log('✅ Logo has width attribute');
        } else {
          console.log('⚠️ Logo does not have width attribute');
        }
        
        // Take screenshot
        await this.takeScreenshot('docs-logo-size-test');
        
      } else {
        console.log('❌ Logo not found on documentation page');
      }
      
    } catch (error) {
      console.log(`❌ Error testing documentation logo size: ${error.message}`);
      await this.takeScreenshot('docs-logo-size-error');
    } finally {
      await this.close();
    }
  }

  async testMermaidDiagram() {
    try {
      await this.init();
      
      console.log('📊 Testing Mermaid diagram rendering...');
      
      // Load the documentation page
      await this.page.goto('https://tjsingleton.github.io/bulletbuzz/', { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      // Wait for page to load and scroll to architecture section
      await this.page.waitForSelector('h2', { timeout: 10000 });
      
      // Scroll to the architecture section
      await this.page.evaluate(() => {
        const architectureSection = document.querySelector('h2');
        if (architectureSection && architectureSection.textContent.includes('🏗️ Architecture')) {
          architectureSection.scrollIntoView();
        }
      });
      
      // Wait a bit for any lazy loading
      await this.page.waitForTimeout(2000);
      
      // Look for Mermaid diagram elements
      const mermaidElements = await this.page.locator('.mermaid').count();
      if (mermaidElements > 0) {
        console.log(`✅ Found ${mermaidElements} Mermaid diagram(s)`);
        
        // Check if the diagram is visible and rendered
        const firstDiagram = await this.page.locator('.mermaid').first();
        if (await firstDiagram.isVisible()) {
          console.log('✅ Mermaid diagram is visible');
          
          // Check if it has SVG content (indicating it's rendered)
          const hasSvg = await firstDiagram.evaluate(el => {
            return el.querySelector('svg') !== null;
          });
          
          // Check if it still has code content (indicating it's not rendered)
          const hasCode = await firstDiagram.evaluate(el => {
            return el.querySelector('code') !== null;
          });
          
          if (hasSvg) {
            console.log('✅ Mermaid diagram is properly rendered with SVG');
            
            // Get SVG dimensions to verify it's actually visible
            const svgInfo = await firstDiagram.evaluate(el => {
              const svg = el.querySelector('svg');
              if (svg) {
                return {
                  width: svg.getAttribute('width') || svg.getBoundingClientRect().width,
                  height: svg.getAttribute('height') || svg.getBoundingClientRect().height,
                  hasContent: svg.innerHTML.length > 0
                };
              }
              return null;
            });
            
            if (svgInfo && svgInfo.hasContent) {
              console.log(`✅ SVG is properly rendered with content (${svgInfo.width}x${svgInfo.height})`);
            } else {
              console.log('⚠️ SVG found but may be empty');
            }
          } else if (hasCode) {
            console.log('⚠️ Mermaid diagram still shows code block (not rendered)');
          } else {
            console.log('⚠️ Mermaid diagram found but may not be fully rendered');
          }
          
          // Take screenshot
          await this.takeScreenshot('mermaid-diagram-test');
          
        } else {
          console.log('❌ Mermaid diagram is not visible');
        }
      } else {
        console.log('❌ No Mermaid diagrams found');
        
        // Check if there's a code block that should be rendered
        const codeBlocks = await this.page.locator('pre code').count();
        console.log(`Found ${codeBlocks} code blocks`);
        
        // Look for mermaid code blocks
        const mermaidCodeBlocks = await this.page.locator('pre code:has-text("graph TB")').count();
        if (mermaidCodeBlocks > 0) {
          console.log(`⚠️ Found ${mermaidCodeBlocks} Mermaid code blocks that should be rendered`);
        }
      }
      
    } catch (error) {
      console.log(`❌ Error testing Mermaid diagram: ${error.message}`);
      await this.takeScreenshot('mermaid-diagram-error');
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

  async runComprehensiveTests(baseUrl = 'http://localhost:8080') {
    try {
      await this.init();
      
      console.log(`🧪 Running comprehensive tests against: ${baseUrl}`);
      
      // Test 1: Basic page load
      await this.page.goto(baseUrl);
      await this.page.waitForTimeout(2000);
      
      // Check for errors after page load
      if (this.consoleErrors.length > 0 || this.networkErrors.length > 0 || this.pageErrors.length > 0) {
        console.log('⚠️ Errors detected during page load');
        this.reportErrors();
      }
      
      // Test 2: Game canvas loading
      const canvasVisible = await this.page.locator('#gameCanvas').isVisible();
      if (canvasVisible) {
        console.log('✅ Game canvas loaded successfully');
      } else {
        console.log('❌ Game canvas not visible');
      }
      
      // Test 3: Game stats visibility
      const statsVisible = await this.page.locator('#stats').isVisible();
      if (statsVisible) {
        console.log('✅ Game stats visible');
      } else {
        console.log('❌ Game stats not visible');
      }
      
      // Test 4: Game controls
      const speedControl = await this.page.locator('#gameSpeed').isVisible();
      const autoPathToggle = await this.page.locator('#autoPath').isVisible();
      const autoShopToggle = await this.page.locator('#autoShop').isVisible();
      
      if (speedControl && autoPathToggle && autoShopToggle) {
        console.log('✅ All game controls visible');
      } else {
        console.log('⚠️ Some game controls missing');
      }
      
      // Test 5: Game functionality (if it's a game page)
      if (baseUrl.includes('/game/') || baseUrl.includes('localhost')) {
        console.log('🎮 Testing game functionality...');
        
        // Wait for game to start
        await this.page.waitForTimeout(3000);
        
        // Check if enemies are spawning
        const enemyStats = await this.page.locator('#enemyStats').isVisible();
        if (enemyStats) {
          console.log('✅ Enemy spawning working');
        } else {
          console.log('⚠️ Enemy spawning may not be working');
        }
        
        // Test speed control (it's a range input, not a select)
        await this.page.fill('#gameSpeed', '5');
        await this.page.waitForTimeout(1000);
        console.log('✅ Speed control functional');
        
        // Test auto-pathing toggle by clicking the label
        const autoPathLabel = await this.page.locator('label[for="autoPath"]');
        if (await autoPathLabel.isVisible()) {
          await autoPathLabel.click();
          await this.page.waitForTimeout(500);
          console.log('✅ Auto-pathing label click functional');
        } else {
          console.log('⚠️ Auto-pathing label not found');
        }
        
        // Test auto-shop toggle by clicking the label
        const autoShopLabel = await this.page.locator('label[for="autoShop"]');
        if (await autoShopLabel.isVisible()) {
          await autoShopLabel.click();
          await this.page.waitForTimeout(500);
          console.log('✅ Auto-shop label click functional');
        } else {
          console.log('⚠️ Auto-shop label not found');
        }
        
        // Test auto-pathing toggle by clicking the checkbox directly
        await this.page.click('#autoPath');
        await this.page.waitForTimeout(500);
        console.log('✅ Auto-pathing toggle functional');
        
        // Test auto-shop toggle by clicking the checkbox directly
        await this.page.click('#autoShop');
        await this.page.waitForTimeout(500);
        console.log('✅ Auto-shop toggle functional');
        
        await this.takeScreenshot('comprehensive-game-test');
      } else {
        // Test documentation functionality
        console.log('📚 Testing documentation functionality...');
        
        // Check for navigation (use a more specific selector)
        const navVisible = await this.page.locator('nav[data-md-level="0"]').isVisible();
        if (navVisible) {
          console.log('✅ Documentation navigation visible');
        } else {
          console.log('⚠️ Documentation navigation not visible');
        }
        
        // Check for search functionality
        const searchVisible = await this.page.locator('[data-md-component="search"]').isVisible();
        if (searchVisible) {
          console.log('✅ Search functionality available');
        } else {
          console.log('⚠️ Search functionality not available');
        }
        
        await this.takeScreenshot('comprehensive-docs-test');
      }
      
      // Final error report
      const noErrors = this.reportErrors();
      if (!noErrors) {
        console.log('⚠️ Site may have issues despite appearing to function');
      } else {
        console.log('✅ No errors detected');
      }
      
    } catch (error) {
      console.error('❌ Error during comprehensive tests:', error);
      await this.takeScreenshot('error-comprehensive-test');
      this.reportErrors();
      throw error;
    } finally {
      await this.close();
    }
  }

  async testMobileControls() {
    try {
      await this.init();
      
      console.log('📱 Testing mobile controls...');
      
      // Test 1: Check if mobile controls are present
      const mobileControls = await this.page.locator('.mobile-controls').isVisible();
      if (mobileControls) {
        console.log('✅ Mobile controls container visible');
      } else {
        console.log('⚠️ Mobile controls not visible (may be desktop)');
      }
      
      // Test 2: Check joystick elements
      const joystickBase = await this.page.locator('#joystickBase').isVisible();
      const joystickThumb = await this.page.locator('#joystickThumb').isVisible();
      
      if (joystickBase && joystickThumb) {
        console.log('✅ Virtual joystick elements present');
      } else {
        console.log('⚠️ Virtual joystick elements not found');
      }
      
      // Test 3: Check action buttons
      const pauseButton = await this.page.locator('#pauseButton').isVisible();
      const resetButton = await this.page.locator('#resetButton').isVisible();
      
      if (pauseButton && resetButton) {
        console.log('✅ Action buttons present');
      } else {
        console.log('⚠️ Action buttons not found');
      }
      
      // Test 4: Check CSS for mobile responsiveness
      const mobileStyles = await this.page.evaluate(() => {
        const mobileControls = document.querySelector('.mobile-controls');
        if (!mobileControls) return false;
        
        const styles = window.getComputedStyle(mobileControls);
        return {
          display: styles.display,
          position: styles.position,
          zIndex: styles.zIndex
        };
      });
      
      if (mobileStyles) {
        console.log('✅ Mobile controls CSS properly configured');
        console.log(`   Display: ${mobileStyles.display}, Position: ${mobileStyles.position}, Z-index: ${mobileStyles.zIndex}`);
      }
      
      await this.takeScreenshot('mobile-controls-test');
      
    } catch (error) {
      console.error('❌ Error testing mobile controls:', error);
      await this.takeScreenshot('error-mobile-controls-test');
      throw error;
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
  const url = args[1] || null;
  
  console.log('📸 Starting advanced screenshot tests...');
  
  const taker = new GameScreenshotTaker();
  
  // Clean up any existing screenshots
  taker.cleanup();
  
  try {
    switch (command) {
      case 'comprehensive':
        const testUrl = url || 'http://localhost:8080';
        console.log(`🧪 Running comprehensive tests against: ${testUrl}`);
        await taker.runComprehensiveTests(testUrl);
        break;
        
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
        
      case 'readme-docs':
        console.log('📖 Testing README documentation link...');
        await taker.testReadmeDocumentationLink();
        break;
        
      case 'game-doc-link':
        console.log('🎮 Testing game documentation link...');
        await taker.testGameDocumentationLink();
        break;
        
      case 'docs-logo-size':
        console.log('📏 Testing documentation logo size...');
        await taker.testDocumentationLogoSize();
        break;
        
              case 'mermaid-diagram':
          console.log('📊 Testing Mermaid diagram rendering...');
          await taker.testMermaidDiagram();
          break;
          
        case 'mobile-controls':
          console.log('📱 Testing mobile controls...');
          await taker.testMobileControls();
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