import { AppState } from 'store';

export const isConnectedToGame = (state: AppState) => state.chats.isConnected;

export const isConnectingToGame = (state: AppState) => state.chats.isConnecting;
