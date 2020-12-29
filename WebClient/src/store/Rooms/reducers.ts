import { produce } from 'immer';
import { Reducer } from 'redux';
import { GameAction, GameActionType } from 'store/Game/constants';
import { RoomsAction, RoomsActionType } from './constants';
import { initialRoomsState, RoomsState } from './store';

export const roomsReducer: Reducer<RoomsState, RoomsAction | GameAction> = (
    state = initialRoomsState,
    action,
) => {
    switch (action.type) {
        case RoomsActionType.roomsRequest:
            return produce(state, draft => {
                draft.isRoomListLoading = true;
            });

        case RoomsActionType.roomsRequestSuccess:
            return produce(state, draft => {
                draft.isRoomListLoading = false;
                draft.roomList = action.payload.data;
            });

        case RoomsActionType.roomsRequestFailed:
            return produce(state, draft => {
                draft.isRoomListLoading = false;
            });

        case RoomsActionType.joinRoom:
        case RoomsActionType.getCurrentRoom:
            return produce(state, draft => {
                draft.isCurrentRoomLoading = true;
            });

        case RoomsActionType.joinRoomSuccess:
        case RoomsActionType.getCurrentRoomSuccess:
        case RoomsActionType.createRoomRequestSuccess:
            return produce(state, draft => {
                draft.isCurrentRoomLoading = false;
                draft.currentRoom = action.payload.data;
            });

        case GameActionType.gameMemberConnected:
            return produce(state, draft => {
                draft.currentRoom?.participants.push(action.user.id);
                draft.currentRoom?.participantsWithNames.push(action.user);
            });

        case GameActionType.gameMemberDisconnected:
            return produce(state, draft => {
                if (!draft.currentRoom)
                    return;

                draft.currentRoom.participants = draft.currentRoom.participants.filter(id => id !== action.user.id);
                draft.currentRoom.participantsWithNames = draft.currentRoom.participantsWithNames.filter(user => user.id !== action.user.id);
            });

        case GameActionType.invokeStartGameSuccess:
            return produce(state, draft => {
                if (!draft.currentRoom)
                    return;

                draft.currentRoom.isGameStarted = true;
                draft.currentRoom.currentGameStateId = action.result.id;
            });

        case GameActionType.gameStarted:
            return produce(state, draft => {
                if (!draft.currentRoom)
                    return;

                draft.currentRoom.isGameStarted = true;
                draft.currentRoom.isGameEnded = false;
            });

        case GameActionType.gameEnded:
            return produce(state, draft => {
                if (!draft.currentRoom)
                    return;

                draft.currentRoom.isGameEnded = true;
                draft.currentRoom.isGameStarted = false;
                draft.currentRoom.winnerRole = action.winnerRoleName;
            });

        default:
            return state;
    }
};
