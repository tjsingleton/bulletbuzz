---
sidebar_position: 3
---

# Screenshot Testing

Documentation for automated visual testing with Playwright.

## Overview

Screenshot testing provides automated visual regression testing using Playwright for cross-browser compatibility.

## Available Commands

```bash
# Basic screenshot test
npm run screenshots

# Advanced screenshot testing
npm run screenshots:advanced

# UI element screenshots
npm run screenshots:ui

# Speed test screenshots
npm run screenshots:speed

# Game state screenshots
npm run screenshots:game-states

# Game over screenshots
npm run screenshots:game-over

# All screenshot tests
npm run screenshots:all

# Clean up screenshots
npm run screenshots:clean
```

## Features

- **Cross-Browser**: Works with Chromium, Firefox, and WebKit
- **Temporary Storage**: Screenshots stored in `.tmp/screenshots/`
- **Automatic Cleanup**: Old screenshots removed before new tests
- **Live-Server Ignored**: Screenshots don't trigger development reloads
- **Git Ignored**: Temporary files not tracked in version control
- **Timestamped Files**: Organized screenshots with timestamps
- **Full Page Capture**: Complete game interface screenshots

## Examples

### Basic Screenshot Test

```javascript
const { takeGameScreenshots } = require('./screenshot-test.js');

// Take screenshots of game states
await takeGameScreenshots();
```

### Advanced Screenshot Class

```javascript
const GameScreenshotTaker = require('./advanced-screenshots.js');

const taker = new GameScreenshotTaker();
await taker.captureGameStates();
await taker.captureUIElements();
await taker.close();
```

## Configuration

### Screenshot Settings

```javascript
// Screenshot options
const options = {
  fullPage: true,
  path: 'screenshot.png',
  viewport: { width: 1200, height: 800 }
};
```

### Browser Configuration

```javascript
const browser = await chromium.launch({ 
  headless: false,
  slowMo: 100
});
```

## Best Practices

### Screenshot Organization

- **Descriptive Names**: Use clear, descriptive filenames
- **Timestamped**: Include timestamps for organization
- **Categorized**: Group related screenshots together
- **Cleanup**: Regular cleanup of old screenshots

### Testing Workflow

- **Development**: Take screenshots during development
- **Regression**: Compare screenshots for visual regressions
- **Documentation**: Use screenshots in documentation
- **CI/CD**: Integrate with continuous integration

## Integration

### GitHub Actions

```yaml
- name: Take Screenshots
  run: npm run screenshots:all
```

### Development Workflow

```bash
# During development
npm run screenshots:ui

# Before commit
npm run screenshots:all

# Clean up
npm run screenshots:clean
``` 