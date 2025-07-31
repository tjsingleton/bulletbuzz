#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class VersionBuilder {
  constructor() {
    this.gitSha = this.getGitSha();
    console.log(`🔧 Building with version: ${this.gitSha}`);
  }

  getGitSha() {
    try {
      return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
    } catch (error) {
      console.log('⚠️ Could not get git SHA, using timestamp');
      return new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    }
  }

  replaceVersionPlaceholders(filePath) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      
      // Replace version placeholders
      content = content.replace(/<%= gitSha %>/g, this.gitSha);
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated version in: ${filePath}`);
        return true;
      } else {
        console.log(`ℹ️ No version placeholders found in: ${filePath}`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Error processing ${filePath}: ${error.message}`);
      return false;
    }
  }

  build() {
    console.log('🚀 Starting build with version replacement...');
    
    // Files that need version replacement
    const filesToProcess = [
      'index.html',
      'docs/index.md'
    ];
    
    let updatedFiles = 0;
    
    filesToProcess.forEach(filePath => {
      if (this.replaceVersionPlaceholders(filePath)) {
        updatedFiles++;
      }
    });
    
    console.log(`\n📊 Build Summary:`);
    console.log(`📋 Version: ${this.gitSha}`);
    console.log(`📝 Files updated: ${updatedFiles}/${filesToProcess.length}`);
    
    if (updatedFiles > 0) {
      console.log(`\n✅ Build completed successfully!`);
      console.log(`📦 Files are ready for deployment with version ${this.gitSha}`);
    } else {
      console.log(`\n⚠️ No files were updated. Check if version placeholders exist.`);
    }
  }
}

// Run the builder
if (require.main === module) {
  const builder = new VersionBuilder();
  builder.build();
}

module.exports = VersionBuilder; 