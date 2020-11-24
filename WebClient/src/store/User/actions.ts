import { ActionCreator } from 'redux';
import { CreateUserResponse, User } from '../../api';
import { CreateUserRequest } from '../../api/requests';
import { RequestActionBundle, TypedActionCreator } from '../utils';

// TODO: ogarnąć jak można normalnie użyć tutaj stałych z suffixami żeby ich ręcznie nie dopisywać
export enum UserActionType {
    getCurrentUser = 'currentUser/REQUEST',
    getCurrentUserSuccess = 'currentUser/REQUEST_SUCCESS',
    getCurrentUserFailed = 'currentUser/REQUEST_FAIL',
    createUser = 'createUser',
    createUserRequest = 'createUser/REQUEST',
    createUserRequestSuccess = 'createUser/REQUEST_SUCCESS',
    createUserRequestFail = 'createUser/REQUEST_FAIL'
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
        UserActionType.createUserRequest,
        UserActionType.createUserRequestSuccess,
        UserActionType.createUserRequestFail,
        CreateUserRequest,
        CreateUserResponse
    > | {
        type: UserActionType.createUser;
        userName: string;
    }
);
/* eslint-enable @typescript-eslint/indent */

export const getCurrentUser: TypedActionCreator<UserAction, UserActionType.getCurrentUser> = () => ({
    type: UserActionType.getCurrentUser,
    isRequestAction: true,
    payload: {
        request: {
            url: '/Users/current',
        }
    }
});

export const createUser: TypedActionCreator<UserAction, UserActionType.createUser> = (userName: string) => ({
    type: UserActionType.createUser,
    userName
});

export const createUserRequest: TypedActionCreator<UserAction, UserActionType.createUserRequest> = (data: CreateUserRequest) => ({
    type: UserActionType.createUserRequest,
    isRequestAction: true,
    payload: {
        request: {
            url: '/Authentication/createUser',
            data
        }
    }
});
