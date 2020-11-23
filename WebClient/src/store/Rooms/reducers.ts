import { produce } from 'immer';
import { Reducer } from 'redux';
import { RoomsAction, RoomsActionType } from './actions';
import { initialRoomsState, RoomsState } from './store';

export const roomsReducer: Reducer<RoomsState, RoomsAction> = (
    state = initialRoomsState,
    action
) => {
    switch (action.type) {
        case RoomsActionType.roomsRequest:
            return produce(state, draft => {
                draft.isLoading = true;
            });

        case RoomsActionType.roomsRequestSuccess:
            return produce(state, draft => {
                draft.isLoading = false;
                draft.roomList = action.payload.data;
            });

        case RoomsActionType.roomsRequestFailed:
            return produce(state, draft => {
                draft.isLoading = false;
            });

        default:
            return state;
    }
};
