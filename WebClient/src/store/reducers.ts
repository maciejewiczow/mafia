import { combineReducers } from 'redux';
import { roomsReducer } from './Rooms/reducers';
import { AppState } from './store';
import { userReducer } from './User/reducers';

export default combineReducers<AppState>({
    currentUser: userReducer,
    rooms: roomsReducer
});
