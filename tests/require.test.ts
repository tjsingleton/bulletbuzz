const { BulletBuzzGame } = require('../dist/BulletBuzzGame.js');

describe('Require Test', () => {
  test('should import BulletBuzzGame', () => {
    expect(BulletBuzzGame).toBeDefined();
    expect(typeof BulletBuzzGame).toBe('function');
  });

  test('should create instance', () => {
    const game = new BulletBuzzGame();
    expect(game).toBeDefined();
  });
}); 