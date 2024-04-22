import { toast } from 'react-toastify';
import { call, put, takeLatest } from 'redux-saga/effects';
import api, { CreateUserResponse, setTokens } from 'api';
import { PickAction } from '../utils';
import { getCurrentUser } from './actions';
import { UserActionType, UserAction } from './constants';
import { AxiosResponse } from 'axios';

function* createUserWatcher() {
    yield takeLatest(UserActionType.createUser, createUserWorker);
}

function* createUserWorker({ userName }: PickAction<UserAction, UserActionType.createUser>) {
    try {
        const token: AxiosResponse<CreateUserResponse> = yield call(api.post, '/users', { userName });
        yield call(setTokens, token.data);

        yield put(getCurrentUser());
    } catch (e) {
        console.error('User creation failed', e);
        if (e instanceof Error)
            toast.error(`Błąd rządania: ${e.message}`);
    }
}

export default {
    createUserWatcher,
};
