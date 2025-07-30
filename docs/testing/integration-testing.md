# Integration Testing

BulletBuzz includes comprehensive integration testing to ensure all systems work together correctly.

## 🧪 Test Categories

### Deployment Integration Tests
- **GitHub Pages Deployment**: Verifies game and docs are accessible
- **Documentation Integration**: Tests links between game and docs
- **Logo Integration**: Verifies logo displays correctly across all pages
- **Mermaid Diagram Integration**: Tests architecture diagram rendering

### Game Integration Tests
- **End-to-End Game Flow**: Complete game session testing
- **UI Integration**: Shop, game over, and HUD functionality
- **System Integration**: Collision, spawning, and level progression
- **Performance Integration**: Memory and performance monitoring

## 🚀 Running Integration Tests

```bash
# Run all integration tests
npm run test:all

# Run specific integration tests
npm run test:github-pages      # Deployment testing
npm run test:documentation     # Documentation testing
npm run test:game-content      # Game functionality testing
npm run test:readme-docs       # README link testing
npm run test:game-doc-link     # Game-to-docs link testing
npm run test:docs-logo-size    # Logo integration testing
npm run test:mermaid-diagram   # Diagram rendering testing
```

## 📊 Test Coverage

### Deployment Integration
- ✅ Game loads correctly on GitHub Pages
- ✅ Documentation site is accessible
- ✅ All assets (JS, CSS, images) load properly
- ✅ Navigation links work correctly
- ✅ Logo displays with correct size
- ✅ Mermaid diagrams render properly

### Game System Integration
- ✅ Player movement and AI integration
- ✅ Enemy spawning and AI integration
- ✅ Combat system integration
- ✅ Pickup system integration
- ✅ Level progression integration
- ✅ Shop system integration

### UI Integration
- ✅ Game canvas rendering
- ✅ Shop modal functionality
- ✅ Game over screen display
- ✅ HUD elements (health, XP, level)
- ✅ Range visualization
- ✅ Performance metrics display

## 🔧 Test Implementation

### Playwright Integration Testing
```javascript
// advanced-screenshots.js
class ScreenshotTaker {
  async testGameContent() {
    // Load game page
    await this.page.goto('https://tjsingleton.github.io/bulletbuzz/game/');
    
    // Wait for game to load
    await this.page.waitForSelector('#gameCanvas');
    
    // Verify game is running
    const canvas = await this.page.locator('#gameCanvas');
    const isVisible = await canvas.isVisible();
    
    // Check for game elements
    const hasPlayer = await this.page.locator('.player').count() > 0;
    const hasEnemies = await this.page.locator('.enemy').count() > 0;
    
    return isVisible && hasPlayer && hasEnemies;
  }
}
```

### Error Detection Integration
```javascript
// Monitor all types of errors
page.on('console', msg => {
  if (msg.type() === 'error') {
    console.log(`❌ Console Error: ${msg.text()}`);
  }
});

page.on('response', response => {
  if (!response.ok()) {
    console.log(`❌ Network Error: ${response.url()} - ${response.status()}`);
  }
});

page.on('pageerror', error => {
  console.log(`❌ Page Error: ${error.message}`);
});
```

## 📋 Test Scenarios

### 1. Complete Game Session
```javascript
async testCompleteGameSession() {
  // Start game
  await this.page.goto('https://tjsingleton.github.io/bulletbuzz/game/');
  await this.page.waitForSelector('#gameCanvas');
  
  // Wait for game to run
  await this.page.waitForTimeout(5000);
  
  // Check game state
  const gameState = await this.page.evaluate(() => {
    return window.game?.getGameState();
  });
  
  // Verify game is running
  expect(gameState.isRunning).toBe(true);
  expect(gameState.player.health).toBeGreaterThan(0);
}
```

### 2. Documentation Integration
```javascript
async testDocumentationIntegration() {
  // Test game-to-docs link
  await this.page.goto('https://tjsingleton.github.io/bulletbuzz/game/');
  const docLink = await this.page.locator('a[href="../"]');
  await docLink.click();
  
  // Verify we're on docs page
  const currentUrl = this.page.url();
  expect(currentUrl).toContain('tjsingleton.github.io/bulletbuzz');
  expect(currentUrl).not.toContain('/game/');
}
```

### 3. Logo Integration Test
```javascript
async testLogoIntegration() {
  // Test logo on docs page
  await this.page.goto('https://tjsingleton.github.io/bulletbuzz/');
  const logo = await this.page.locator('img[alt*="BulletBuzz Logo"]');
  
  // Verify logo size
  const logoWidth = await logo.evaluate(el => el.getBoundingClientRect().width);
  expect(logoWidth).toBeGreaterThan(80);
  expect(logoWidth).toBeLessThan(120);
}
```

## 🐛 Common Integration Issues

### Deployment Issues
1. **404 Errors**: Game files not deployed to GitHub Pages
2. **Asset Loading**: CSS/JS files not loading correctly
3. **Path Issues**: Incorrect relative paths in deployed files

### Game Integration Issues
1. **Canvas Not Loading**: Game not initializing properly
2. **AI Not Working**: Player or enemy AI not functioning
3. **Systems Not Connected**: Collision or spawning not working

### Documentation Issues
1. **Links Broken**: Navigation links not working
2. **Logo Not Displaying**: Image paths incorrect
3. **Mermaid Not Rendering**: JavaScript not loading

## 📈 Test Results

### Success Criteria
- ✅ All pages load without errors
- ✅ Game runs smoothly
- ✅ Documentation is accessible
- ✅ All links work correctly
- ✅ Assets load properly
- ✅ No console or network errors

### Failure Indicators
- ❌ 404 errors for game files
- ❌ Console errors in browser
- ❌ Game not loading or running
- ❌ Broken navigation links
- ❌ Missing or incorrect assets

## 🔄 Continuous Integration

Integration tests run:
- On every deployment
- Before merging pull requests
- During development for quick feedback
- As part of the CI/CD pipeline

The integration testing ensures all systems work together correctly and provides immediate feedback on any issues.
