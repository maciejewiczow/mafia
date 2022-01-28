import { AnyAction, applyMiddleware, compose, createStore } from 'redux';
import axiosMiddleware from 'redux-axios-middleware';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';

import api from 'api';
import { AxiosMiddlewareOptions, requestActionErrorSuffix, requestActionSuccessSuffix } from './constants';
import createRootReducer from './reducers';
import rootSaga from './rootSaga';

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const axios = axiosMiddleware(
    api,
    {
        successSuffix: requestActionSuccessSuffix,
        errorSuffix: requestActionErrorSuffix,
        isAxiosRequest: (action: AnyAction) => !!action.isRequestAction,
    } as AxiosMiddlewareOptions,
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
        ),
    ),
);

sagaMiddleware.run(rootSaga);
