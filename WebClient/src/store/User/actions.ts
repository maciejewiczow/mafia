import { ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { CreateUserResponse, User } from '../../api';
import { CreateUserRequest } from '../../api/requests';
import { RequestActionBundle } from '../utils';

// TODO: ogarnąć jak można normalnie użyć tutaj stałych z suffixami żeby ich ręcznie nie dopisywać
export enum UserActionType {
    getCurrentUser = 'currentUser/REQUEST',
    getCurrentUserSuccess = 'currentUser/REQUEST_SUCCESS',
    getCurrentUserFailed = 'currentUser/REQUEST_FAIL',
    createUser = 'createUser/REQUEST',
    createUserSuccess = 'createUser/REQUEST_SUCCESS',
    createUserFail = 'createUser/REQUEST_FAIL'
}

/* eslint-disable @typescript-eslint/indent */
export type UserAction = (
    RequestActionBundle<
        UserActionType.getCurrentUser,
        UserActionType.getCurrentUserSuccess,
        UserActionType.getCurrentUserFailed,
        never,
        User
    > |
    RequestActionBundle<
        UserActionType.createUser,
        UserActionType.createUserSuccess,
        UserActionType.createUserFail,
        CreateUserRequest,
        CreateUserResponse
    >
);
/* eslint-enable @typescript-eslint/indent */

export const getCurrentUser: ActionCreator<UserAction> = () => ({
    type: UserActionType.getCurrentUser,
    payload: {
        request: {
            url: '/Users/current',
        }
    }
});

export const createUser: ActionCreator<UserAction> = (data: CreateUserRequest) => ({
    type: UserActionType.createUser,
    payload: {
        request: {
            url: '/Authentication/createUser',
            data
        }
    }
});
