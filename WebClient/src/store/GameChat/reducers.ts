import { combineReducers, Reducer } from 'redux';
import { AppState } from 'store/constants';
import { chatsReducer } from './Chat/reducers';
import { GameChatAction, GameChatActionType } from './constants';
import { gameReducer } from './Game/reducers';
import {
    GameChatConnectedState,
    GameChatConnectingState,
    GameChatState,
    initialChatConnectedState,
    initialChatConnectingState,
} from './store';

const gameChatConnectedReducer: Reducer<GameChatConnectedState, GameChatAction> = (
    state = initialChatConnectedState,
    action,
) => {
    switch (action.type) {
        case GameChatActionType.connect:
            return false;

        case GameChatActionType.connectSuccess:
            return true;

        default:
            return state;
    }
};

const gameChatConnectingReducer: Reducer<GameChatConnectingState, GameChatAction> = (
    state = initialChatConnectingState,
    action,
) => {
    switch (action.type) {
        case GameChatActionType.connect:
            return true;

        case GameChatActionType.connectSuccess:
            return false;

        default:
            return state;
    }
};

export const gameChatReducer = combineReducers<GameChatState>({
    isConnected: gameChatConnectedReducer,
    isConnecting: gameChatConnectingReducer,
    chats: chatsReducer,
    game: gameReducer,
});
