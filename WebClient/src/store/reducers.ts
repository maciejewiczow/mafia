import { combineReducers } from 'redux';
import { History } from 'history';
import { connectRouter } from 'connected-react-router';

import { AppState } from './constants';
import { roomsReducer } from './Rooms/reducers';
import { userReducer } from './User/reducers';
import { chatsReducer } from './Chat/reducers';
import { gameReducer } from './Game/reducers';

const createRootReducer = (history: History) => combineReducers<AppState>({
    router: connectRouter(history),
    currentUser: userReducer,
    rooms: roomsReducer,
    chats: chatsReducer,
    game: gameReducer,
});

export default createRootReducer;
