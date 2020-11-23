import { AxiosInstance, AxiosResponse } from 'axios';
import { applyMiddleware, compose, createStore } from 'redux';
import axiosMiddleware from 'redux-axios-middleware';
import thunk from 'redux-thunk';

import api from '../api';
import { requestActionErrorSuffix, requestActionSuccessSuffix } from './constants';
import rootReducer from './reducers';
import { CurrentUserState } from './User/store';

export interface AppState {
    currentUser: CurrentUserState;
}

type AxiosMiddlewareOptions = Partial<{
    errorSuffix: string;
    successSuffix: string;
    onSuccess({ action, next, response }?: any, options?: any): any;
    onError({ action, next, response }?: any, options?: any): any;
    onComplete(): any;
    returnRejectedPromiseOnError: boolean;
    isAxiosRequest: boolean;
    getRequestConfig: AxiosResponse;
    getClientName: AxiosInstance;
    defaultClientName: string;
    getRequestOptions: any;
    interceptors: {
        request?: any[];
        response?: any[];
    };
}>;

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const axios = axiosMiddleware(
    api,
    {
        successSuffix: requestActionSuccessSuffix,
        errorSuffix: requestActionErrorSuffix,
    } as AxiosMiddlewareOptions
);

export const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(axios, thunk))
);

store.subscribe(() => console.log('Store update:', store.getState()));

