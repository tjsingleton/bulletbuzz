#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class DeployMonitor {
  constructor() {
    this.maxAttempts = 30; // 5 minutes with 10 second delays
    this.delayMs = 10000; // 10 seconds
    this.gameUrl = 'https://tjsingleton.github.io/bulletbuzz/game/';
    this.docsUrl = 'https://tjsingleton.github.io/bulletbuzz/';
    this.apiUrl = 'https://tjsingleton.github.io/bulletbuzz/game/dist/game-ui.js';
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getGitSha() {
    try {
      return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
    } catch (error) {
      console.log('⚠️ Could not get git SHA, using timestamp');
      return new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    }
  }

  async checkUrl(url, description) {
    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        headers: {
          'User-Agent': 'DeployMonitor/1.0'
        }
      });
      
      if (response.ok) {
        console.log(`✅ ${description}: ${response.status} ${response.statusText}`);
        return true;
      } else {
        console.log(`❌ ${description}: ${response.status} ${response.statusText}`);
        return false;
      }
    } catch (error) {
      console.log(`❌ ${description}: ${error.message}`);
      return false;
    }
  }

  async checkVersion(url, description) {
    try {
      const response = await fetch(url);
      const text = await response.text();
      
      // Look for version information in the page
      const versionMatch = text.match(/version["\s:]+([a-f0-9]{7,})/i);
      if (versionMatch) {
        console.log(`📋 ${description} version: ${versionMatch[1]}`);
        return versionMatch[1];
      } else {
        console.log(`⚠️ ${description}: No version found in response`);
        return null;
      }
    } catch (error) {
      console.log(`❌ ${description}: Could not check version - ${error.message}`);
      return null;
    }
  }

  async monitor() {
    const gitSha = this.getGitSha();
    console.log(`🚀 Starting deployment monitor for commit: ${gitSha}`);
    console.log(`⏰ Max wait time: ${this.maxAttempts * this.delayMs / 1000} seconds`);
    console.log('');

    let attempt = 1;
    let allSitesUp = false;

    while (attempt <= this.maxAttempts && !allSitesUp) {
      console.log(`\n📡 Attempt ${attempt}/${this.maxAttempts} - ${new Date().toLocaleTimeString()}`);
      
      // Check all URLs
      const gameStatus = await this.checkUrl(this.gameUrl, 'Game Site');
      const docsStatus = await this.checkUrl(this.docsUrl, 'Documentation');
      const apiStatus = await this.checkUrl(this.apiUrl, 'Game API');
      
      if (gameStatus && docsStatus && apiStatus) {
        console.log('\n🎉 All sites are up! Checking versions...');
        
        const gameVersion = await this.checkVersion(this.gameUrl, 'Game');
        const docsVersion = await this.checkVersion(this.docsUrl, 'Documentation');
        
        if (gameVersion && docsVersion) {
          console.log(`\n✅ Deployment complete!`);
          console.log(`📋 Expected SHA: ${gitSha}`);
          console.log(`🎮 Game version: ${gameVersion}`);
          console.log(`📚 Docs version: ${docsVersion}`);
          
          if (gameVersion === gitSha && docsVersion === gitSha) {
            console.log(`\n🎯 Perfect! All sites are running the latest commit.`);
          } else {
            console.log(`\n⚠️ Version mismatch detected. Sites may still be updating.`);
          }
          
          allSitesUp = true;
        } else {
          console.log(`\n⏳ Sites are up but version info not yet available. Continuing...`);
        }
      } else {
        console.log(`\n⏳ Some sites still down. Waiting ${this.delayMs/1000} seconds...`);
        await this.sleep(this.delayMs);
      }
      
      attempt++;
    }

    if (!allSitesUp) {
      console.log(`\n⏰ Timeout reached after ${this.maxAttempts} attempts.`);
      console.log('🔍 Final status check:');
      await this.checkUrl(this.gameUrl, 'Game Site');
      await this.checkUrl(this.docsUrl, 'Documentation');
      await this.checkUrl(this.apiUrl, 'Game API');
    }
  }
}

// Run the monitor
async function main() {
  const monitor = new DeployMonitor();
  await monitor.monitor();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = DeployMonitor; 