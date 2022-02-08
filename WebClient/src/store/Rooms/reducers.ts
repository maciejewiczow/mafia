import { produce } from 'immer';
import { Reducer } from 'redux';
import { GameChatAction, GameChatActionType } from 'store/GameChat/constants';
import { GameAction, GameActionType } from 'store/GameChat/Game/constants';
import { RoomsAction, RoomsActionType } from './constants';
import { initialRoomsState, RoomsState } from './store';

export const roomsReducer: Reducer<RoomsState, RoomsAction | GameAction | GameChatAction> = (
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

        case GameChatActionType.memberConnected:
            return produce(state, draft => {
                if (!draft.currentRoom?.participants.includes(action.user.id))
                    draft.currentRoom?.participants.push(action.user.id);

                if ((draft.currentRoom?.participantsWithNames.filter(u => u.id === action.user.id).length ?? 1) === 0)
                    draft.currentRoom?.participantsWithNames.push(action.user);
            });

        case GameChatActionType.memberDisconnected:
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

                draft.currentRoom.hasGameStarted = true;
                draft.currentRoom.currentGameState = action.result;
            });

        case GameActionType.gameStarted:
            return produce(state, draft => {
                if (!draft.currentRoom)
                    return;

                draft.currentRoom.hasGameStarted = true;
                draft.currentRoom.hasGameEnded = false;
            });

        case GameActionType.gameEnded:
            return produce(state, draft => {
                if (!draft.currentRoom)
                    return;

                draft.currentRoom.hasGameEnded = true;
                draft.currentRoom.hasGameStarted = false;
                draft.currentRoom.winnerRole = action.winnerRoleName;
            });

        case RoomsActionType.updateRoomSettings:
            return produce(state, draft => {
                if (!draft.currentRoom)
                    return;

                Object.assign(draft.currentRoom.gameOptions, action.options);
            });

        default:
            return state;
    }
};
