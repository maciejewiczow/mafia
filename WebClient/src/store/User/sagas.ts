import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../../api';
import { setTokens } from '../../api/tokens';
import { PickAction } from '../utils';
import { getCurrentUser } from './actions';
import { UserActionType, UserAction } from './constants';

function* createUserWatcher() {
    yield takeLatest(UserActionType.createUser, createUserWorker);
}

function* createUserWorker({ userName }: PickAction<UserAction, UserActionType.createUser>) {
    try {
        const token = yield call(api.post, '/Users/create', { userName });
        yield call(setTokens, token.data);

        yield put(getCurrentUser());
    } catch (e) {
        console.error('User creation failed', e);
    }
}

export default {
    createUserWatcher
};
