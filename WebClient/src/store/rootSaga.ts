import { Saga } from 'redux-saga';
import { all, call, put, spawn } from 'redux-saga/effects';
import { getAccessToken } from '../api/tokens';

import * as roomsSagas from './Rooms/sagas';
import { getCurrentUser } from './User/actions';

const spawnAll = (sagasExport: {[key: string]: Saga}) => Object.values(sagasExport).map(saga => spawn(saga));

function* initSaga() {
    const token = yield call(getAccessToken);

    if(token !== null)
        yield put(getCurrentUser());
}

export default function* rootSaga() {
    yield all([
        ...spawnAll(roomsSagas),
        call(initSaga)
    ]);
}

