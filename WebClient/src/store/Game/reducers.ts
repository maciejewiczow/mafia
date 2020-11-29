import { produce } from 'immer';
import { Reducer } from 'redux';
import { GameAction, GameActionType } from './constants';
import { initialGameState, GameStateInStore } from './store';

export const gameReducer: Reducer<GameStateInStore, GameAction> = (
    state = initialGameState,
    action
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
                state.currentGameState?.voteState.push(action.vote);
            });

            // case GameActionType.gameEnded:
            //     return produce(state, draft => {

            //     });

            // case GameActionType.votingResult:
            //     return produce(state, draft => {

            //     });

        case GameActionType.stateUpdate:
            return produce(state, draft => {
                draft.currentGameState = action.state;
            });

        default:
            return state;
    }
};
