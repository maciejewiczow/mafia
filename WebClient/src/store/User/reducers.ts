import { produce } from 'immer';
import { Reducer } from 'redux';

import { UserActionType, UserAction } from './actions';
import { CurrentUserState, initialCurrentUserState } from './store';

export const userReducer: Reducer<CurrentUserState, UserAction> = (
    state = initialCurrentUserState,
    action
) => {
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

        default:
            return state;
    }
};

