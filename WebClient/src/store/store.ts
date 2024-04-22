import { applyMiddleware, compose, legacy_createStore as createStore, UnknownAction } from 'redux';
import axiosMiddleware from 'redux-axios-middleware';
import { createBrowserHistory } from 'history';
import createSagaMiddleware from 'redux-saga';

import { isDevEnv } from 'isDevEnv';
import api from 'api';
import { AxiosMiddlewareOptions, requestActionErrorSuffix, requestActionSuccessSuffix } from './constants';
import createRootReducer from './reducers';
import rootSaga from './rootSaga';
import { createReduxHistoryContext } from 'redux-first-history';

const composeEnhancers = (isDevEnv && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const axios = axiosMiddleware(
    api,
    {
        successSuffix: requestActionSuccessSuffix,
        errorSuffix: requestActionErrorSuffix,
        isAxiosRequest: (action: UnknownAction) => !!action.isRequestAction,
    } as AxiosMiddlewareOptions,
);

const sagaMiddleware = createSagaMiddleware();

export const history = createBrowserHistory();

const { routerMiddleware, routerReducer } = createReduxHistoryContext({
    history,
});

export const store = createStore(
    createRootReducer(routerReducer),
    composeEnhancers(
        applyMiddleware(
            routerMiddleware,
            sagaMiddleware,
            axios,
        ),
    ),
);

sagaMiddleware.run(rootSaga);
