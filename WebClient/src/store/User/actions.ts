import { AxiosResponse } from 'axios';
import { User } from 'api';
import { PickAction } from 'store/utils';
import { UserAction, UserActionType } from './constants';

export const getCurrentUser = (): PickAction<UserAction, UserActionType.getCurrentUser> => ({
    type: UserActionType.getCurrentUser,
    isRequestAction: true,
    payload: {
        request: {
            url: '/users/current',
        },
    },
});

export const getCurrentUserSuccess = (payload: AxiosResponse<User>): PickAction<UserAction, UserActionType.getCurrentUserSuccess> => ({
    type: UserActionType.getCurrentUserSuccess,
    payload,
});

export const createUser = (userName: string): PickAction<UserAction, UserActionType.createUser> => ({
    type: UserActionType.createUser,
    userName,
});
