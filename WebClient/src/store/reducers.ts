import { combineReducers, Reducer, UnknownAction } from 'redux';
import { RouterState } from 'redux-first-history';
import { gameChatReducer } from './GameChat/reducers';
import { roomsReducer } from './Rooms/reducers';
import { userReducer } from './User/reducers';

export const createRootReducer = (
    routerReducer: Reducer<RouterState, UnknownAction, RouterState>,
) => combineReducers({
        router: routerReducer,
        currentUser: userReducer,
        rooms: roomsReducer,
        gameChat: gameChatReducer,
    });
