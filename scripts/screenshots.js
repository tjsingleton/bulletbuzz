#!/usr/bin/env node

const { cleanupScreenshots } = require('../screenshot-test.js');
const GameScreenshotTaker = require('../advanced-screenshots.js');

const command = process.argv[2];

async function runCommand() {
  switch (command) {
    case 'clean':
      console.log('🧹 Cleaning up screenshots...');
      cleanupScreenshots();
      console.log('✅ Screenshots cleaned up');
      break;
      
    case 'ui':
      console.log('📸 Capturing UI elements...');
      const taker1 = new GameScreenshotTaker();
      await taker1.captureUIElements();
      await taker1.close();
      console.log('✅ UI screenshots captured');
      break;
      
    case 'speed':
      const speed = process.argv[3] || 10;
      console.log(`📸 Capturing speed test at ${speed}x...`);
      const taker2 = new GameScreenshotTaker();
      await taker2.captureSpeedTest(parseInt(speed));
      await taker2.close();
      console.log('✅ Speed screenshots captured');
      break;
      
    case 'game-states':
      console.log('📸 Capturing game states...');
      const taker3 = new GameScreenshotTaker();
      await taker3.captureGameStates();
      await taker3.close();
      console.log('✅ Game state screenshots captured');
      break;
      
    case 'game-over':
      console.log('📸 Capturing game over details...');
      const taker4 = new GameScreenshotTaker();
      await taker4.captureGameOverDetails();
      await taker4.close();
      console.log('✅ Game over screenshots captured');
      break;
      
    case 'all':
      console.log('📸 Running all screenshot tests...');
      const taker5 = new GameScreenshotTaker();
      await taker5.captureGameStates();
      await taker5.captureSpeedTest(10);
      await taker5.captureUIElements();
      await taker5.captureGameOverDetails();
      await taker5.close();
      console.log('✅ All screenshots captured');
      break;
      
    default:
      console.log('📸 BulletBuzz Screenshot Commands:');
      console.log('');
      console.log('  npm run screenshots:clean      - Clean up temporary screenshots');
      console.log('  npm run screenshots:ui         - Capture UI element screenshots');
      console.log('  npm run screenshots:speed      - Capture speed test screenshots');
      console.log('  npm run screenshots:game-states - Capture game state screenshots');
      console.log('  npm run screenshots:game-over  - Capture game over screenshots');
      console.log('  npm run screenshots:all        - Run all screenshot tests');
      console.log('');
      console.log('  npm run screenshots            - Basic screenshot test');
      console.log('  npm run screenshots:advanced   - Advanced screenshot test');
      console.log('');
      console.log('💡 Make sure the development server is running: npm run dev');
      break;
  }
}

runCommand().catch(console.error); 