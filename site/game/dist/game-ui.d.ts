declare function printGameState(): void;
declare function copyGameState(): void;
declare function togglePause(): void;
declare function resetGame(): void;
declare global {
    interface Window {
        togglePause: typeof togglePause;
        resetGame: typeof resetGame;
        printGameState: typeof printGameState;
        copyGameState: typeof copyGameState;
    }
}
export {};
