import { AxiosResponse } from 'axios';
import { replace } from 'connected-react-router';
import { toast } from 'react-toastify';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import * as roomSelectors from 'store/Rooms/selectors';
import api, { GameRoom } from 'api';
import * as userSelectors from 'store/User/selectors';
import { PickAction } from 'store/utils';
import { AppState } from 'store/store';
import { createRoomSuccess, getCurrentRoomSuccess, joinRoomSuccess } from './actions';
import { RoomsActionType, RoomsAction } from './constants';

function* createRoomWatcher() {
    yield takeLatest(RoomsActionType.createRoom, createRoomWorker);
}

function* createRoomWorker({ name }: PickAction<RoomsAction, RoomsActionType.createRoom>) {
    try {
        const result: AxiosResponse<GameRoom> = yield call(api.post, `/gameRooms?name=${encodeURIComponent(name)}`);

        yield put(createRoomSuccess(result));
        yield put(replace('room'));
    } catch (e) {
        console.error('Room creation failed', e);
        toast.error('Podczas tworzenia pokoju wystąpił błąd');
    }
}

function* joinRoomWatcher() {
    yield takeLatest(RoomsActionType.joinRoom, joinRoomWorker);
}

function* joinRoomWorker(action: PickAction<RoomsAction, RoomsActionType.joinRoom>) {
    try {
        const room: AxiosResponse<GameRoom> = yield call(api.post, `/gameRooms/${action.roomId}/join`);

        yield put(joinRoomSuccess(room));
        yield put(replace('room'));
    } catch (error) {
        console.error('Joining room failed with error: ', error);
        toast.error(`Podczs dołączania do pokoju wystąpił błąd: ${error.message}`);
    }
}

export function* getCurrentRoomWorker() {
    const isUserInAnyRoom: string | undefined = yield select(userSelectors.currentUserRoom);
    if (!isUserInAnyRoom)
        return;

    try {
        put({ type: RoomsActionType.getCurrentRoom });
        const room: AxiosResponse<GameRoom> = yield call(api.get, '/gameRooms/current');

        yield put(getCurrentRoomSuccess(room));
        const hasGameStarted = yield select(roomSelectors.hasCurrentGameStarted);
        const path: string = yield select((state: AppState) => state.router.location.pathname);

        if (path === '/') {
            if (!hasGameStarted)
                yield put(replace('room'));
            else
                yield put(replace('game'));
        }

        if (path === '/room' && hasGameStarted)
            yield put(replace('game'));
    } catch (error) {
        console.log('Current room request failed with error: ', error);
        toast.error(`Błąd rządania: ${error.message}`);
    }
}

export default {
    createRoomWatcher,
    joinRoomWatcher,
};
