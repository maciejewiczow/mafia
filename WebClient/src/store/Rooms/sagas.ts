import { AxiosResponse } from 'axios';
import { replace } from 'connected-react-router';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import api, { GameRoom } from '../../api';
import * as userSelectors from '../User/selectors';
import { PickAction } from '../utils';
import { joinRoomSuccess } from './actions';
import { RoomsActionType, RoomsAction } from './constants';

function* createRoomWatcher() {
    yield takeLatest(RoomsActionType.createRoom, createRoomWorker);
}

function* createRoomWorker({ name }: PickAction<RoomsAction, RoomsActionType.createRoom>) {
    try {
        const result: AxiosResponse<GameRoom> = yield call(api.post, `/GameRooms/create?name=${encodeURIComponent(name)}`);
        yield put(joinRoomSuccess(result));
        yield put(replace('room'));
    } catch (e) {
        console.error('Room creation failed', e);
    }
}

function* joinRoomWatcher() {
    yield takeLatest(RoomsActionType.joinRoom, joinRoomWorker);
}

function* joinRoomWorker(action: PickAction<RoomsAction, RoomsActionType.joinRoom>) {
    try {
        const room: AxiosResponse<GameRoom> = yield call(api.post, `/GameRooms/join/${action.roomId}`);

        yield put(joinRoomSuccess(room));
        yield put(replace('room'));
    } catch (error) {
        console.error('Joining room failed with error: ', error);
    }
}

export function* getCurrentRoomWorker() {
    const isUserInAnyRoom: string | undefined = yield select(userSelectors.currentUserRoom);
    if (!isUserInAnyRoom)
        return;

    try {
        const room: AxiosResponse<GameRoom> = yield call(api.get, '/GameRooms/current');

        yield put(joinRoomSuccess(room));
        yield put(replace('room'));
    } catch (error) {
        console.log('Current room request failed with error: ', error);
    }
}

export default {
    createRoomWatcher,
    joinRoomWatcher
};
