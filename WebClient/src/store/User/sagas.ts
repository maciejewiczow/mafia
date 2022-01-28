import { toast } from 'react-toastify';
import { call, put, takeLatest } from 'redux-saga/effects';
import api, { setTokens } from 'api';
import { PickAction } from '../utils';
import { getCurrentUser } from './actions';
import { UserActionType, UserAction } from './constants';

function* createUserWatcher() {
    yield takeLatest(UserActionType.createUser, createUserWorker);
}

function* createUserWorker({ userName }: PickAction<UserAction, UserActionType.createUser>) {
    try {
        const token = yield call(api.post, '/users', { userName });
        yield call(setTokens, token.data);

        yield put(getCurrentUser());
    } catch (e) {
        console.error('User creation failed', e);
        toast.error(`Błąd rządania: ${e.message}`);
    }
}

export default {
    createUserWatcher,
};
