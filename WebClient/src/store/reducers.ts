import { combineReducers, Reducer, UnknownAction } from 'redux';

import { roomsReducer } from './Rooms/reducers';
import { userReducer } from './User/reducers';
import { gameChatReducer } from './GameChat/reducers';
import { RouterState } from 'redux-first-history';

const createRootReducer = (routerReducer: Reducer<RouterState, UnknownAction, RouterState>) => combineReducers({
    router: routerReducer,
    currentUser: userReducer,
    rooms: roomsReducer,
    gameChat: gameChatReducer,
});

export default createRootReducer;
