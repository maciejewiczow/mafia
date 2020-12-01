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
    yield take(GameActionType.invokeStartGameSuccess);
    yield put(replace('/game'));
}

function* gameStartedWatcher() {
    yield takeLatest(GameActionType.gameStarted, gameStartedWorker);
}

// API-FIX: send game state from hub in gameStarted event to prevent route jumping
function* gameStartedWorker() {
    yield put(replace('/game'));
}

export default {
    startGameWatcher,
    gameStartedWatcher,
};
