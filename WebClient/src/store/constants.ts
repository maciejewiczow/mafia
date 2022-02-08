import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { RouterState } from 'connected-react-router';
import { AnyAction } from 'redux';

import { RoomsState } from './Rooms/store';
import { CurrentUserState } from './User/store';
import { GameChatState } from './GameChat/store';

export interface AppState {
    router: RouterState;
    currentUser: CurrentUserState;
    rooms: RoomsState;
    gameChat: GameChatState;
}

export type AxiosMiddlewareOptions = Partial<{
    errorSuffix: string;
    successSuffix: string;
    onSuccess({ action, next, response }?: any, options?: any): any;
    onError({ action, next, response }?: any, options?: any): any;
    onComplete(): any;
    returnRejectedPromiseOnError: boolean;
    isAxiosRequest: (action: AnyAction) => boolean;
    getRequestConfig: (action: AnyAction) => AxiosRequestConfig;
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
