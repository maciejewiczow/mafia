import { Saga } from 'redux-saga';
import { all, call, put, spawn } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import api, { User, getAccessToken } from 'api';
import { getCurrentUserSuccess } from './User/actions';

import roomsWatchers, { getCurrentRoomWorker } from './Rooms/sagas';
import userWatchers from './User/sagas';
import gameWatchers from './GameChat/Game/sagas';
import gameChatWatchers from './GameChat/sagas';
import { AsyncRetT } from './utils';

const spawnAll = (sagasExport: {[key: string]: Saga}) => Object.values(sagasExport).map(saga => spawn(saga));

function* initSaga() {
    const token: AsyncRetT<typeof getAccessToken> = yield call(getAccessToken);

    if (token !== null) {
        try {
            const result: AxiosResponse<User> = yield call(api.get, '/Users/current');
            yield put(getCurrentUserSuccess(result));
        } catch (err) {
            console.log('Get current user failed with error', err);
        }
    }

    yield call(getCurrentRoomWorker);
}

export default function* rootSaga() {
    yield all([
        ...spawnAll(userWatchers),
        ...spawnAll(roomsWatchers),
        ...spawnAll(gameWatchers),
        ...spawnAll(gameChatWatchers),
        call(initSaga),
    ]);
}
