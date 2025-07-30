const fs = require('fs');
const path = require('path');

// Copy game files to docs build directory
const gameFiles = [
  'index.html',
  'dist/BulletBuzzGame.js',
  'dist/game-ui.js',
  'dist/types.js',
  'dist/core/',
  'dist/systems/'
];

const sourceDir = path.join(__dirname, '..');
const targetDir = path.join(__dirname, 'build');

console.log('Copying game files to docs build directory...');

// Copy index.html
const indexHtml = fs.readFileSync(path.join(sourceDir, 'index.html'), 'utf8');
// Update the script paths to be relative to the docs build directory
const updatedIndexHtml = indexHtml
  .replace('./dist/BulletBuzzGame.js', './dist/BulletBuzzGame.js')
  .replace('dist/game-ui.js', './dist/game-ui.js');
fs.writeFileSync(path.join(targetDir, 'index.html'), updatedIndexHtml);

// Copy dist directory
const distSource = path.join(sourceDir, 'dist');
const distTarget = path.join(targetDir, 'dist');

if (!fs.existsSync(distTarget)) {
  fs.mkdirSync(distTarget, { recursive: true });
}

// Copy all files from dist directory
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const items = fs.readdirSync(src);
  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(distSource, distTarget);

console.log('Game files copied successfully!');
console.log('The game will be available at the root URL and docs at /docs/'); 