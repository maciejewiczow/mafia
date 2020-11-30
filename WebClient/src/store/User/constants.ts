import { CreateUserResponse, User } from '../../api';
import { CreateUserRequest } from '../../api/requests';
import { RequestActionBundle } from '../utils';

// TODO: ogarnąć jak można normalnie użyć tutaj stałych z suffixami żeby ich ręcznie nie dopisywać
export enum UserActionType {
    getCurrentUser = 'currentUser/REQUEST',
    getCurrentUserSuccess = 'currentUser/REQUEST_SUCCESS',
    getCurrentUserFailed = 'currentUser/REQUEST_FAIL',
    createUser = 'createUser',
    createUserRequest = 'createUser/REQUEST',
    createUserRequestSuccess = 'createUser/REQUEST_SUCCESS',
    createUserRequestFail = 'createUser/REQUEST_FAIL',
}

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
