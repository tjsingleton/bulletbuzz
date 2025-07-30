# Testing Overview

## 🎯 Testing Philosophy

We believe in comprehensive, automated testing that provides confidence across all environments. Our testing strategy combines unit tests, integration tests, and comprehensive environment testing to ensure quality and reliability.

## 🏗️ Testing Systems

### Unit Testing
- **Framework**: Jest for TypeScript unit tests
- **Coverage**: Core game logic, systems, and utilities
- **Location**: `tests/` directory with corresponding source structure
- **Command**: `npm test`
- **Documentation**: [Unit Testing](unit-testing.md)

### Integration Testing
- **Framework**: Playwright for browser automation
- **Scope**: Game functionality, documentation, deployment
- **Features**: Error detection, screenshot capture, content verification
- **Command**: `npm run test:all`
- **Documentation**: [Integration Testing](integration-testing.md)

### Comprehensive Testing
- **Framework**: Unified Playwright system with URL parameter support
- **Scope**: Any environment (local, staging, production)
- **Features**: Environment detection, error classification, unified testing
- **Command**: `npm run test:comprehensive:*`
- **Documentation**: [Comprehensive Testing](comprehensive-testing.md)

### Screenshot Testing
- **Framework**: Playwright with visual verification
- **Scope**: UI elements, game states, documentation
- **Features**: Automated screenshots, content assertions, error monitoring
- **Command**: `npm run screenshots:*`
- **Documentation**: [Screenshot Testing](screenshot-testing.md)

## 🚀 Quick Start

### Run All Tests
```bash
# Unit tests
npm test

# Integration tests
npm run test:all

# Comprehensive tests
npm run test:comprehensive:all

# Screenshot tests
npm run screenshots:all
```

### Test Specific Environments
```bash
# Local development
npm run test:comprehensive:local

# GitHub Pages game
npm run test:comprehensive:game

# GitHub Pages docs
npm run test:comprehensive:docs
```

### Test Custom URLs
```bash
# Test any URL
node advanced-screenshots.js comprehensive https://your-url.com/
```

## 📊 Test Coverage

### Current Coverage
- **Unit Tests**: 51 tests covering core game systems
- **Integration Tests**: Game functionality, documentation, deployment
- **Comprehensive Tests**: Any environment with unified testing
- **Screenshot Tests**: Visual verification and error detection

### Coverage Areas
- ✅ **Core Game Logic**: Player, Enemy, Game systems
- ✅ **Event System**: Event registration, emission, cleanup
- ✅ **Game UI**: Canvas, controls, stats display
- ✅ **Documentation**: Navigation, search, content
- ✅ **Deployment**: GitHub Pages, local development
- ✅ **Error Detection**: Console, network, page errors

## 🎓 Key Achievements

### Unified Testing System
- **Single Method**: `runComprehensiveTests(baseUrl)` works with any URL
- **Environment Detection**: Automatically detects game vs documentation sites
- **Flexible Parameters**: Command-line URL parameter support
- **Comprehensive Coverage**: Page load, error detection, functionality testing

### Error Handling
- **Console Errors**: JavaScript errors and warnings
- **Network Errors**: Failed HTTP requests (404s, timeouts)
- **Page Errors**: Unhandled exceptions and DOM errors
- **Error Classification**: Distinguish expected vs unexpected errors

### Environment Support
- **Local Development**: Handles `/game/` path structure
- **GitHub Pages**: Works with deployed `/game/` subdirectory
- **Documentation**: Adapts to MkDocs Material theme complexity
- **Custom URLs**: Test any environment with command-line parameters

## 📚 Documentation

### Testing Guides
- [Unit Testing](unit-testing.md) - Jest-based unit tests
- [Integration Testing](integration-testing.md) - Browser automation
- [Comprehensive Testing](comprehensive-testing.md) - Unified testing system
- [Screenshot Testing](screenshot-testing.md) - Visual verification
- [Test Coverage Report](test-coverage-report.md) - Coverage analysis

### Achievements and Learnings
- [Testing Achievements](testing-achievements.md) - What we built and achieved
- [Performance Testing](performance-testing.md) - Performance benchmarks
- [Headless Simulation](headless-simulation.md) - Automated game simulation

## 🔧 Configuration

### npm Scripts
```json
{
  "test": "jest",
  "test:all": "npm test && npm run test:github-pages && npm run test:documentation",
  "test:comprehensive:local": "node advanced-screenshots.js comprehensive http://localhost:8080/game/",
  "test:comprehensive:game": "node advanced-screenshots.js comprehensive https://tjsingleton.github.io/bulletbuzz/game/",
  "test:comprehensive:docs": "node advanced-screenshots.js comprehensive https://tjsingleton.github.io/bulletbuzz/",
  "test:comprehensive:all": "npm run test:comprehensive:local && npm run test:comprehensive:game && npm run test:comprehensive:docs"
}
```

### Environment Variables
```bash
# Debug mode for detailed logging
DEBUG=pw:api npm run test:comprehensive:game

# Custom timeout for slow environments
PLAYWRIGHT_TIMEOUT=60000 npm run test:comprehensive:docs
```

## 🎯 Best Practices

### Testing Strategy
1. **Run unit tests first**: Fast feedback on code changes
2. **Test local before deploying**: Catch issues early
3. **Verify deployment**: Ensure changes work in production
4. **Monitor for errors**: Track console, network, and page errors
5. **Document learnings**: Share insights for future development

### Error Handling
- **Accept expected errors**: Favicon 404s, missing assets
- **Monitor critical errors**: Game files, navigation, functionality
- **Classify by impact**: Cosmetic vs functional failures
- **Provide context**: Include error details and resolution steps

### Environment Management
- **Test all environments**: Local, staging, production
- **Use consistent commands**: Same tests across environments
- **Monitor deployments**: Pre and post-deployment verification
- **Document differences**: Environment-specific behaviors

## 🔮 Future Enhancements

### Planned Improvements
- **Enhanced Error Classification**: Categorize by severity and impact
- **Environment-Specific Configurations**: Custom settings per environment
- **Automated Reporting**: Generate test reports and health scores
- **CI/CD Integration**: Automated testing in deployment pipelines

### Potential Extensions
- **Performance Testing**: Load times and resource usage
- **Accessibility Testing**: Screen reader and keyboard navigation
- **Cross-Browser Testing**: Chrome, Firefox, Safari support
- **Mobile Testing**: Responsive design verification

This comprehensive testing system provides confidence across all environments and ensures high-quality deployments with minimal configuration changes. 