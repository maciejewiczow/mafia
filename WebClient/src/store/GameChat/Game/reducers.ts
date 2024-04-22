import { produce } from 'immer';
import { Reducer } from 'redux';
import { RoomsAction, RoomsActionType } from 'store/Rooms/constants';
import { GameAction, GameActionType } from './constants';
import { GameStateInStore,initialGameState } from './store';

export const gameReducer: Reducer<
    GameStateInStore,
    GameAction | RoomsAction
> = (state = initialGameState, action) => {
    switch (action.type) {
        case GameActionType.newVote:
            return produce(state, draft => {
                draft?.voteState.push(action.vote);
            });

        case GameActionType.votingResult:
            return produce(state, draft => {
                if (draft) {draft.voteState = [];}
            });

        case GameActionType.stateUpdate:
            return {
                ...(state ?? {}),
                ...action.state,
            };

        case RoomsActionType.joinRoomSuccess:
        case RoomsActionType.getCurrentRoomSuccess:
        case RoomsActionType.createRoomRequestSuccess:
            return {
                ...(state ?? {}),
                ...action.payload.data.currentGameState,
            };

        default:
            return state;
    }
};
