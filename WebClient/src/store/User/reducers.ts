import { produce } from 'immer';
import { Reducer } from 'redux';
import { RoomsAction, RoomsActionType } from '../Rooms/constants';
import { UserAction, UserActionType } from './constants';
import { CurrentUserState, initialCurrentUserState } from './store';

export const userReducer: Reducer<
    CurrentUserState,
    UserAction | RoomsAction
> = (state = initialCurrentUserState, action) => {
    switch (action.type) {
        case UserActionType.getCurrentUser:
            return produce(state, draft => {
                draft.isLoading = true;
            });

        case UserActionType.getCurrentUserFailed:
            return produce(state, draft => {
                draft.isLoading = false;
            });

        case UserActionType.getCurrentUserSuccess:
            return produce(state, draft => {
                draft.isLoading = false;
                draft.user = action.payload.data;
            });

        case RoomsActionType.joinRoomSuccess:
        case RoomsActionType.getCurrentRoomSuccess:
        case RoomsActionType.createRoomRequestSuccess:
            return produce(state, draft => {
                if (draft.user) {
                    draft.user.roomId = action.payload.data.id;
                }
            });

        default:
            return state;
    }
};
