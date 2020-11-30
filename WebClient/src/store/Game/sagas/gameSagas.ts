import { replace } from 'connected-react-router';
import { put, take, takeLatest } from 'redux-saga/effects';
import { PickAction } from 'store/utils';
import { invokeStartGame } from '../actions';
import { GameAction, GameActionType } from '../constants';

function* startGameWatcher() {
    yield takeLatest(GameActionType.startGame, startGameWorker);
}

function* startGameWorker() {
    yield put(invokeStartGame());
    yield take(GameActionType.stateUpdate);
    yield put(replace('/game'));
}

export default {
    startGameWatcher,
};
