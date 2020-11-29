import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { AnyAction, applyMiddleware, compose, createStore } from 'redux';
import axiosMiddleware from 'redux-axios-middleware';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';

import api from 'api';
import { requestActionErrorSuffix, requestActionSuccessSuffix } from './constants';
import createRootReducer from './reducers';
import { RoomsState } from './Rooms/store';
import { CurrentUserState } from './User/store';
import rootSaga from './rootSaga';
import { ChatsState } from './Chat/store';

export interface AppState {
    currentUser: CurrentUserState;
    rooms: RoomsState;
    chats: ChatsState;
}

type AxiosMiddlewareOptions = Partial<{
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

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const axios = axiosMiddleware(
    api,
    {
        successSuffix: requestActionSuccessSuffix,
        errorSuffix: requestActionErrorSuffix,
        isAxiosRequest: (action: AnyAction) => !!action.isRequestAction,
    } as AxiosMiddlewareOptions
);

const sagaMiddleware = createSagaMiddleware();

export const history = createBrowserHistory();

export const store = createStore(
    createRootReducer(history),
    composeEnhancers(
        applyMiddleware(
            routerMiddleware(history),
            sagaMiddleware,
            axios,
        )
    )
);

sagaMiddleware.run(rootSaga);
