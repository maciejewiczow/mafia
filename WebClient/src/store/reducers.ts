import { combineReducers } from 'redux';
import { History } from 'history';
import { connectRouter } from 'connected-react-router';

import { AppState } from './constants';
import { roomsReducer } from './Rooms/reducers';
import { userReducer } from './User/reducers';
import { gameChatReducer } from './GameChat/reducers';

const createRootReducer = (history: History) => combineReducers<AppState>({
    router: connectRouter(history),
    currentUser: userReducer,
    rooms: roomsReducer,
    gameChat: gameChatReducer,
});

export default createRootReducer;
