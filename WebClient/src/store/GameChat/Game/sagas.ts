import { replace } from 'redux-first-history';
import { put, take, takeLatest } from 'redux-saga/effects';
import { invokeAddMeToGroups } from '../actions';
import { invokeStartGame } from './actions';
import { GameActionType } from './constants';

function* startGameWatcher() {
    yield takeLatest(GameActionType.startGame, startGameWorker);
}

function* startGameWorker() {
    yield put(invokeStartGame());
    yield take(GameActionType.invokeStartGameSuccess);
    yield put(invokeAddMeToGroups());
    yield put(replace('/game'));
}

function* gameStartedWatcher() {
    yield takeLatest(GameActionType.gameStarted, gameStartedWorker);
}

function* gameStartedWorker() {
    yield take(GameActionType.stateUpdate);
    yield put(invokeAddMeToGroups());
    yield put(replace('/game'));
}

export default {
    startGameWatcher,
    gameStartedWatcher,
};
