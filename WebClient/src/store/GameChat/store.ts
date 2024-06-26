import { ChatsState } from './Chat/store';
import { GameStateInStore } from './Game/store';

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
