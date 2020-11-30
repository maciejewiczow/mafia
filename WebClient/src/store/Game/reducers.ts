import { produce } from 'immer';
import { Reducer } from 'redux';
import { RoomsAction, RoomsActionType } from 'store/Rooms/constants';
import { GameAction, GameActionType } from './constants';
import { initialGameState, GameStateInStore } from './store';

export const gameReducer: Reducer<GameStateInStore, GameAction | RoomsAction> = (
    state = initialGameState,
    action,
) => {
    switch (action.type) {
        case GameActionType.connectToGame:
            return produce(state, draft => {
                draft.isConnected = false;
                draft.isConnecting = true;
            });

        case GameActionType.connectToGameSuccess:
            return produce(state, draft => {
                draft.isConnected = true;
                draft.isConnecting = false;
            });

        case GameActionType.newVote:
            return produce(state, draft => {
                draft.currentGameState?.voteState.push(action.vote);
            });

            // case GameActionType.votingResult:
            //     return produce(state, draft => {

            //     });

        case GameActionType.stateUpdate:
            return produce(state, draft => {
                draft.currentGameState = action.state;
            });

        case RoomsActionType.joinRoomSuccess:
        case RoomsActionType.getCurrentRoomSuccess:
        case RoomsActionType.createRoomRequestSuccess:
            return produce(state, draft => {
                if (action.payload.data.isGameStarted && action.payload.data.gameHistory.length > 0) {
                    const [currentState] = action.payload.data.gameHistory;
                    draft.currentGameState = currentState;
                }
            });

        default:
            return state;
    }
};
