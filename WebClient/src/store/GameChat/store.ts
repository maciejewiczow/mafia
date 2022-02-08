import { ChatsState, initialChatState } from './Chat/store';
import { GameStateInStore, initialGameState } from './Game/store';

export type GameChatConnectedState = boolean;
export type GameChatConnectingState = boolean;

export const initialChatConnectedState: GameChatConnectedState = false;
export const initialChatConnectingState: GameChatConnectingState = false;

export interface GameChatState {
    isConnected: GameChatConnectedState;
    isConnecting: GameChatConnectingState;
    chats: ChatsState;
    game: GameStateInStore;
}
