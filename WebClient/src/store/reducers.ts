import { combineReducers } from 'redux';
import { History } from 'history';
import { connectRouter, RouterState } from 'connected-react-router';

import { roomsReducer } from './Rooms/reducers';
import { AppState } from './store';
import { userReducer } from './User/reducers';

const createRootReducer = (history: History) => combineReducers<AppState & {router: RouterState}>({
    router: connectRouter(history),
    currentUser: userReducer,
    rooms: roomsReducer
});

export default createRootReducer;
