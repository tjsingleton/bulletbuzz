# Comprehensive Testing System

The comprehensive testing system allows you to run the same set of tests against different environments with just a parameter change.

## 🎯 Overview

The `runComprehensiveTests()` method provides a unified testing approach that:

- **Tests any URL**: Local development, staging, production, or any environment
- **Detects environment type**: Automatically determines if testing a game or documentation site
- **Comprehensive checks**: Page load, error detection, functionality testing, and screenshots
- **Flexible execution**: Command-line parameters or npm scripts

## 🚀 Quick Start

### Test Local Development
```bash
npm run test:comprehensive:local
```

### Test GitHub Pages Game
```bash
npm run test:comprehensive:game
```

### Test GitHub Pages Documentation
```bash
npm run test:comprehensive:docs
```

### Test All Environments
```bash
npm run test:comprehensive:all
```

### Test Custom URL
```bash
node advanced-screenshots.js comprehensive https://your-custom-url.com/
```

## 📋 Test Coverage

### Game Environment Tests
- ✅ Page load and error detection
- ✅ Game canvas visibility
- ✅ Game stats display
- ✅ Control elements (speed, auto-path, auto-shop)
- ✅ Game functionality (enemy spawning, controls working)
- ✅ Screenshot capture

### Documentation Environment Tests
- ✅ Page load and error detection
- ✅ Navigation visibility
- ✅ Search functionality
- ✅ Screenshot capture

### Universal Tests
- ✅ Console error detection
- ✅ Network error monitoring
- ✅ Page error handling
- ✅ Comprehensive error reporting

## 🔧 Configuration

### Environment Detection
The system automatically detects the environment type:

```javascript
if (baseUrl.includes('/game/') || baseUrl.includes('localhost')) {
  // Run game-specific tests
} else {
  // Run documentation-specific tests
}
```

### Error Handling
- **Console Errors**: JavaScript errors and warnings
- **Network Errors**: Failed HTTP requests (404s, timeouts)
- **Page Errors**: Unhandled exceptions and DOM errors

## 📊 Test Results

### Success Indicators
- ✅ **Game Canvas**: `#gameCanvas` visible
- ✅ **Game Stats**: `#stats` element present
- ✅ **Controls**: All game controls functional
- ✅ **Navigation**: Documentation navigation working
- ✅ **Search**: Search functionality available

### Error Reporting
- ⚠️ **Console Errors**: JavaScript errors in browser console
- ❌ **Network Errors**: Failed resource loading
- ⚠️ **Page Errors**: Unhandled exceptions

## 🛠️ Customization

### Adding New Tests
```javascript
// In runComprehensiveTests method
if (baseUrl.includes('/game/')) {
  // Add custom game tests
  const customTest = await this.page.locator('#customElement').isVisible();
  if (customTest) {
    console.log('✅ Custom test passed');
  }
} else {
  // Add custom documentation tests
  const customDocTest = await this.page.locator('.custom-doc-element').isVisible();
  if (customDocTest) {
    console.log('✅ Custom documentation test passed');
  }
}
```

### Custom Error Thresholds
```javascript
// Modify error tolerance
const maxErrors = 5;
if (this.consoleErrors.length > maxErrors) {
  console.log(`⚠️ Too many console errors: ${this.consoleErrors.length}`);
}
```

## 📁 Output

### Screenshots
- `comprehensive-game-test-{timestamp}.png`
- `comprehensive-docs-test-{timestamp}.png`
- `error-comprehensive-test-{timestamp}.png`

### Logs
- Detailed console output with test results
- Error summaries with counts and types
- Performance metrics and timing

## 🔄 Continuous Integration

### GitHub Actions Integration
```yaml
- name: Run Comprehensive Tests
  run: |
    npm run test:comprehensive:game
    npm run test:comprehensive:docs
```

### Pre-deployment Testing
```bash
# Test before deployment
npm run test:comprehensive:local
npm run test:comprehensive:game
```

## 🎯 Best Practices

1. **Run before deployments**: Ensure changes work in all environments
2. **Monitor error patterns**: Track recurring issues across environments
3. **Use in CI/CD**: Automate testing in deployment pipelines
4. **Customize for your needs**: Add environment-specific tests
5. **Review screenshots**: Visual verification of functionality

## 🔍 Troubleshooting

### Common Issues
- **Timeout errors**: Increase wait times for slow environments
- **Missing elements**: Update selectors for different page structures
- **Network errors**: Check if resources are available in target environment

### Debug Mode
```javascript
// Enable detailed logging
this.isDebugMode = true;
```

This unified testing system provides consistent, reliable testing across all environments with minimal configuration changes. 