---
sidebar_position: 2
---

# Headless Simulation

Documentation for automated headless testing and balance analysis.

## Overview

Headless simulation allows running thousands of games automatically to test game balance and performance.

## Test Runner

### Basic Usage

```bash
# Run basic simulation
node test-runner.js

# Quick balance test
node test-runner.js --quick

# Custom parameters
node test-runner.js --runs 10 --target 5 --time 300
```

### Configuration Options

```bash
# Number of simulation runs
--runs 100

# Target level to reach
--target 10

# Maximum time per run (seconds)
--time 300

# Quick mode for faster testing
--quick
```

## Simulation Features

### Balance Testing

- **Success Rate**: Percentage of runs reaching target level
- **Average Time**: Time to reach target level
- **Survival Rate**: Percentage of runs where player survives
- **Performance Metrics**: Memory usage and frame rates

### Performance Analysis

- **Memory Usage**: Track memory consumption over time
- **Frame Rate**: Monitor frame rate consistency
- **Object Count**: Track number of game objects
- **Cleanup Efficiency**: Monitor object cleanup

### Statistical Analysis

- **Win/Loss Ratios**: Track success rates
- **Time Distribution**: Analyze completion times
- **Difficulty Curves**: Test progression scaling
- **Parameter Sensitivity**: Test configuration changes

## Examples

### Basic Simulation

```javascript
const testRunner = require('./test-runner.js');

// Run 100 simulations
const results = await testRunner.runSimulations({
  runs: 100,
  targetLevel: 10,
  maxTime: 300
});

console.log(`Success Rate: ${results.successRate}%`);
console.log(`Average Time: ${results.averageTime}s`);
```

### Balance Testing

```javascript
// Test different configurations
const configs = [
  { enemySpeed: 0.1, spawnInterval: 10.0 },
  { enemySpeed: 0.15, spawnInterval: 8.0 },
  { enemySpeed: 0.2, spawnInterval: 6.0 }
];

for (const config of configs) {
  const results = await testRunner.testConfiguration(config);
  console.log(`Config ${config}: ${results.successRate}% success`);
}
```

## Output Analysis

### Success Metrics

- **Success Rate**: Percentage of successful runs
- **Average Time**: Mean time to reach target
- **Standard Deviation**: Time consistency
- **Median Time**: Typical completion time

### Performance Metrics

- **Memory Usage**: Peak and average memory
- **Frame Rate**: Minimum and average FPS
- **Object Count**: Maximum objects created
- **Cleanup Rate**: Object cleanup efficiency

### Balance Metrics

- **Difficulty Curve**: How difficulty scales
- **Player Survival**: Survival rate analysis
- **Enemy Effectiveness**: Enemy impact on success
- **Upgrade Impact**: Shop upgrade effectiveness

## Best Practices

### Simulation Design

- **Sufficient Sample Size**: Run enough simulations for statistical significance
- **Consistent Parameters**: Use consistent parameters across test runs
- **Random Seed Control**: Control randomness for reproducible results
- **Performance Monitoring**: Monitor system resources during long runs

### Analysis

- **Statistical Significance**: Ensure results are statistically significant
- **Outlier Detection**: Identify and analyze outliers
- **Trend Analysis**: Look for patterns in the data
- **Comparative Analysis**: Compare different configurations

### Optimization

- **Parallel Processing**: Run multiple simulations in parallel
- **Memory Management**: Monitor and optimize memory usage
- **Early Termination**: Stop runs that exceed time limits
- **Progress Tracking**: Track progress during long runs

## Integration

### CI/CD Integration

```yaml
# GitHub Actions
- name: Run Balance Tests
  run: node test-runner.js --runs 50 --target 5
```

### Automated Testing

```bash
# Run balance tests before deployment
npm run test:balance

# Generate balance report
npm run test:balance:report
```

### Performance Monitoring

```javascript
// Monitor simulation performance
const startTime = Date.now();
const startMemory = process.memoryUsage();

// Run simulation
await runSimulation();

const endTime = Date.now();
const endMemory = process.memoryUsage();

console.log(`Time: ${endTime - startTime}ms`);
console.log(`Memory: ${endMemory.heapUsed - startMemory.heapUsed} bytes`);
``` 