import { BulletBuzzGame } from '../src/BulletBuzzGame';

describe('Simple Game Test', () => {
  test('should create game instance', () => {
    const game = new BulletBuzzGame();
    expect(game).toBeDefined();
    expect(game).toBeInstanceOf(BulletBuzzGame);
  });

  test('should get game state', () => {
    const game = new BulletBuzzGame();
    const state = game.getGameState();
    expect(state).toBeDefined();
    expect(state.gameTime).toBe(0);
    expect(state.level).toBe(1);
  });
}); 