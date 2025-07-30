# Screenshot Testing

BulletBuzz uses Playwright for comprehensive automated screenshot testing and error detection.

## 🆕 Comprehensive Testing System

For unified testing across all environments, see the [Comprehensive Testing System](comprehensive-testing.md) which allows you to run the same tests against any URL with just a parameter change.

### Quick Start
```bash
# Test any environment
npm run test:comprehensive:local    # Local development
npm run test:comprehensive:game     # GitHub Pages game
npm run test:comprehensive:docs     # GitHub Pages docs
npm run test:comprehensive:all      # All environments
```

## 🧪 Test Types

### Core Tests
- **`test:github-pages`**: Tests game deployment on GitHub Pages
- **`test:documentation`**: Tests documentation site functionality
- **`test:game-content`**: Tests game content and functionality
- **`test:readme-docs`**: Tests README documentation link
- **`test:game-doc-link`**: Tests game's documentation link
- **`test:docs-logo-size`**: Tests logo size on documentation
- **`test:mermaid-diagram`**: Tests Mermaid diagram rendering

### Error Detection
The testing system automatically detects and reports:
- **Console Errors**: JavaScript errors and warnings
- **Network Errors**: Failed HTTP requests (404s, timeouts)
- **Page Errors**: Unhandled exceptions and DOM errors
- **Response Errors**: API failures and server errors

## 🚀 Running Tests

```bash
# Run all tests
npm run test:all

# Run specific test
npm run test:github-pages
npm run test:documentation
npm run test:game-content
npm run test:readme-docs
npm run test:game-doc-link
npm run test:docs-logo-size
npm run test:mermaid-diagram

# Run deployment tests
npm run test:all
```

## 📊 Test Features

### Content Assertions
Tests verify expected content before taking screenshots:
- Logo presence and size
- Navigation elements
- Game canvas loading
- Documentation links
- Mermaid diagram rendering

### Error Monitoring
Real-time detection of:
- Console errors and warnings
- Network request failures
- Page load timeouts
- JavaScript exceptions

### Screenshot Management
- Automatic cleanup of temporary files
- Timestamped screenshots for debugging
- Organized storage in `.tmp/screenshots/`

## 🔧 Test Configuration

### Playwright Setup
```javascript
// advanced-screenshots.js
class ScreenshotTaker {
  async init() {
    this.browser = await chromium.launch({ headless: true });
    this.page = await this.browser.newPage();
  }
  
  async takeScreenshot(name) {
    await this.page.screenshot({ 
      path: `.tmp/screenshots/${name}-${timestamp}.png` 
    });
  }
}
```

### Error Detection
```javascript
// Monitor console errors
page.on('console', msg => {
  if (msg.type() === 'error') {
    console.log(`❌ Console Error: ${msg.text()}`);
  }
});

// Monitor network errors
page.on('response', response => {
  if (!response.ok()) {
    console.log(`❌ Response Error: ${response.url()} - ${response.status()}`);
  }
});
```

## 📋 Test Examples

### Logo Size Test
```javascript
async testDocumentationLogoSize() {
  // Load documentation page
  await this.page.goto('https://tjsingleton.github.io/bulletbuzz/');
  
  // Find logo and check size
  const logo = await this.page.locator('img[alt*="BulletBuzz Logo"]');
  const logoWidth = await logo.evaluate(el => el.getBoundingClientRect().width);
  
  // Verify expected size (100px)
  if (logoWidth <= 120 && logoWidth >= 80) {
    console.log('✅ Logo size is correct');
  }
}
```

### Mermaid Diagram Test
```javascript
async testMermaidDiagram() {
  // Find Mermaid diagrams
  const mermaidElements = await this.page.locator('.mermaid').count();
  
  // Check for SVG rendering
  const hasSvg = await element.evaluate(el => 
    el.querySelector('svg') !== null
  );
  
  if (hasSvg) {
    console.log('✅ Mermaid diagram is properly rendered');
  }
}
```

## 🐛 Troubleshooting

### Common Issues
1. **404 Errors**: Game files not deployed properly
2. **Timeout Errors**: Page taking too long to load
3. **Logo Size Issues**: CSS not applying correctly
4. **Mermaid Not Rendering**: JavaScript not loading

### Debug Commands
```bash
# Check deployment status
curl -I https://tjsingleton.github.io/bulletbuzz/

# View screenshots
open .tmp/screenshots/

# Run specific test with verbose output
DEBUG=pw:api npm run test:docs-logo-size
```

## 📈 Test Results

### Success Indicators
- ✅ All tests pass without errors
- ✅ Screenshots captured successfully
- ✅ Content assertions pass
- ✅ No console or network errors

### Failure Indicators
- ❌ Timeout errors
- ❌ 404 errors for game files
- ❌ Console errors in browser
- ❌ Content assertions fail

## 🔄 Continuous Integration

Tests are automatically run:
- On every deployment
- Before merging pull requests
- During development for quick feedback

The testing system provides immediate feedback on deployment issues and ensures the game and documentation are always functional.
