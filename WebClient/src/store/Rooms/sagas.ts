import { AxiosResponse } from 'axios';
import { push } from 'connected-react-router';
import { channel } from 'redux-saga';
import { call, put, takeLatest } from 'redux-saga/effects';
import api, { GameRoom } from '../../api';
import { PickAction } from '../utils';
import { createRoomSuccess, RoomsAction, RoomsActionType } from './actions';

export function* createRoomWatcher() {
    yield takeLatest(RoomsActionType.createRoom, createRoomWorker);
}

function* createRoomWorker({ name }: PickAction<RoomsAction, RoomsActionType.createRoom>) {
    try {
        const result: AxiosResponse<GameRoom> = yield call(api.post, `/GameRooms/create?name=${encodeURIComponent(name)}`);
        yield put(createRoomSuccess(result));
        yield put(push('room'));
    } catch (e) {
        console.error('Room creation failed', e);
    }
}
