import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../../api';
import { setTokens } from '../../api/tokens';
import { PickAction } from '../utils';
import { getCurrentUser, UserAction, UserActionType } from './actions';

export function* createUserWatcher() {
    yield takeLatest(UserActionType.createUser, createUserWorker);
}

export function* createUserWorker({ userName }: PickAction<UserAction, UserActionType.createUser>) {
    try {
        const token = yield call(api.post, '/Authentication/createUser', { userName });
        yield call(setTokens, token.data);

        yield put(getCurrentUser());
    } catch(e) {
        console.error('User creation failed', e);
    }
}
