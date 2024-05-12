/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { UnknownAction } from 'redux';
import { RouterState } from 'redux-first-history';
import { ChatAction } from './GameChat/Chat/constants';
import { GameChatAction } from './GameChat/constants';
import { GameAction } from './GameChat/Game/constants';
import { GameChatState } from './GameChat/store';
import { RoomsAction } from './Rooms/constants';
import { RoomsState } from './Rooms/store';
import { UserAction } from './User/constants';
import { CurrentUserState } from './User/store';

export interface AppState {
    router: RouterState;
    currentUser: CurrentUserState;
    rooms: RoomsState;
    gameChat: GameChatState;
}

export type AppAction =
    | RoomsAction
    | UserAction
    | GameChatAction
    | GameAction
    | ChatAction
    | UnknownAction;

export type AxiosMiddlewareOptions = Partial<{
    errorSuffix: string;
    successSuffix: string;
    onSuccess({ action, next, response }?: any, options?: any): any;
    onError({ action, next, response }?: any, options?: any): any;
    onComplete(): any;
    returnRejectedPromiseOnError: boolean;
    isAxiosRequest: (action: UnknownAction) => boolean;
    getRequestConfig: (action: UnknownAction) => AxiosRequestConfig;
    getClientName: AxiosInstance;
    defaultClientName: string;
    getRequestOptions: any;
    interceptors: {
        request?: any[];
        response?: any[];
    };
}>;

export const requestActionSuccessSuffix = '_SUCCESS';
export const requestActionErrorSuffix = '_FAIL';
