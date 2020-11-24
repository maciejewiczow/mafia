import { Saga } from 'redux-saga';
import { all, call, put, spawn } from 'redux-saga/effects';
import { getAccessToken } from '../api/tokens';

import roomsWatchers, { getCurrentRoomWorker } from './Rooms/sagas';
import userWatchers from './User/sagas';
import { getCurrentUserSuccess } from './User/actions';
import api, { User } from '../api';
import { AxiosResponse } from 'axios';

const spawnAll = (sagasExport: {[key: string]: Saga}) => Object.values(sagasExport).map(saga => spawn(saga));

function* initSaga() {
    const token = yield call(getAccessToken);

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
        call(initSaga)
    ]);
}

