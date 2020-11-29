import { GameState } from 'api';

export interface GameStateInStore {
    isConnected: boolean;
    isConnecting: boolean;
    currentGameState?: GameState;
}

export const initialGameState: GameStateInStore = {
    isConnected: false,
    isConnecting: false,
};
