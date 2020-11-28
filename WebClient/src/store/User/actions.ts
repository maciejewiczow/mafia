import { AxiosResponse } from 'axios';
import { User } from '../../api';
import { TypedActionCreator } from '../utils';
import { UserAction, UserActionType } from './constants';

export const getCurrentUser: TypedActionCreator<UserAction, UserActionType.getCurrentUser> = () => ({
    type: UserActionType.getCurrentUser,
    isRequestAction: true,
    payload: {
        request: {
            url: '/Users/current',
        }
    }
});

export const getCurrentUserSuccess: TypedActionCreator<UserAction, UserActionType.getCurrentUserSuccess> = (payload: AxiosResponse<User>) => ({
    type: UserActionType.getCurrentUserSuccess,
    payload
});

export const createUser: TypedActionCreator<UserAction, UserActionType.createUser> = (userName: string) => ({
    type: UserActionType.createUser,
    userName
});
