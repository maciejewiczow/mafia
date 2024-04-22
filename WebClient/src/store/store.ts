import { api } from 'api';
import { createBrowserHistory } from 'history';
import { isDevEnv } from 'isDevEnv';
import {
    applyMiddleware,
    compose,
    legacy_createStore as createStore,
    UnknownAction,
} from 'redux';
import axiosMiddleware from 'redux-axios-middleware';
import { createReduxHistoryContext } from 'redux-first-history';
import createSagaMiddleware from 'redux-saga';
import {
    AxiosMiddlewareOptions,
    requestActionErrorSuffix,
    requestActionSuccessSuffix,
} from './constants';
import { createRootReducer } from './reducers';
import { rootSaga } from './rootSaga';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const composeEnhancers =
    (isDevEnv && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    compose;

const axios = axiosMiddleware(api, {
    successSuffix: requestActionSuccessSuffix,
    errorSuffix: requestActionErrorSuffix,
    isAxiosRequest: (action: UnknownAction) => !!action.isRequestAction,
} as AxiosMiddlewareOptions);

const sagaMiddleware = createSagaMiddleware();

export const history = createBrowserHistory();

const { routerMiddleware, routerReducer } = createReduxHistoryContext({
    history,
});

export const store = createStore(
    createRootReducer(routerReducer),
    composeEnhancers(applyMiddleware(routerMiddleware, sagaMiddleware, axios)),
);

sagaMiddleware.run(rootSaga);
