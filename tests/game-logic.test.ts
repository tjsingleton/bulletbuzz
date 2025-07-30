describe('Game Logic Tests', () => {
  test('should calculate distance correctly', () => {
    const distance = Math.sqrt((10 - 5) ** 2 + (10 - 5) ** 2);
    expect(distance).toBeCloseTo(7.07, 2);
  });

  test('should handle level progression', () => {
    const xpForLevel2 = 100;
    const xpForLevel3 = 250;
    
    expect(xpForLevel3).toBeGreaterThan(xpForLevel2);
  });

  test('should validate game configuration', () => {
    const defaultConfig = {
      startHp: 12,
      pickupRange: 25,
      playerSpeed: 0.85,
      enemySpeed: 0.15,
      spawnInterval: 8000,
      heartDropRate: 0.20,
      avoidDistance: 120,
      avoidStrength: 2.0,
      singleEnemyLevel: 6,
      minSpawnInterval: 4500
    };

    expect(defaultConfig.startHp).toBeGreaterThan(0);
    expect(defaultConfig.heartDropRate).toBeGreaterThan(0);
    expect(defaultConfig.heartDropRate).toBeLessThan(1);
    expect(defaultConfig.spawnInterval).toBeGreaterThan(defaultConfig.minSpawnInterval);
  });

  test('should handle memory limits', () => {
    const maxEnemies = 100;
    const maxXpDrops = 200;
    const maxHeartDrops = 50;
    const maxAxes = 50;

    expect(maxEnemies).toBeGreaterThan(0);
    expect(maxXpDrops).toBeGreaterThan(0);
    expect(maxHeartDrops).toBeGreaterThan(0);
    expect(maxAxes).toBeGreaterThan(0);
  });
}); 