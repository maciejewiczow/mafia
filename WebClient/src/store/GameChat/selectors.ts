import { AppState } from 'store';

export const isConnectedToGameChat = (state: AppState) => state.gameChat.isConnected;

export const isConnectingToGameChat = (state: AppState) => state.gameChat.isConnecting;
