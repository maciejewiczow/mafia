import { call, take, fork, takeLatest, apply, put } from 'redux-saga/effects';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { buffers, END, EventChannel, eventChannel } from 'redux-saga';
import { AnyAction } from 'redux';
import { toast } from 'react-toastify';
import { getAccessToken } from 'api/tokens';
import { InvokeAction } from 'store/utils';
import { GameState, User, VoteState } from 'api';
import { GameAction, GameActionType, gameHubClientName } from '../constants';
import {
    connectToGameSuccess,
    gameEnded,
    gameMemberConnected,
    gameMemberDisconnected,
    newVote,
    stateUpdate,
    votingResult,
} from '../actions';

function* connectToGameWatcher() {
    yield takeLatest(GameActionType.connectToGame, connectToGameWorker);
}

const getTokenOrThrow = async () => {
    const token = await getAccessToken();

    if (!token)
        throw new Error('Cannot connect to game without token');

    return token;
};

function* connectToGameWorker() {
    try {
        const connection = new HubConnectionBuilder()
            .withUrl('http://localhost:5000/hubs/game', { accessTokenFactory: getTokenOrThrow })
            .configureLogging(LogLevel.Information)
            .build();

        const channel: ReturnType<typeof subscribe> = yield call(subscribe, connection);

        yield fork(incomingActionsWatcher, channel);
        yield fork(invokeActionsWatcher, connection);
        yield apply(connection, connection.start, []);
        yield put(connectToGameSuccess());
    } catch (error) {
        console.error('Game error:', error);
        toast.error(`Błąd gry: ${error.message}`);
    }
}

const subscribe = (connection: HubConnection) => (
    eventChannel<GameAction>(
        emit => {
            connection.on('UpdateGameStateAsync', (state: GameState) => emit(stateUpdate(state)));
            connection.on('GameMemberConnectedAsync', (user: User) => emit(gameMemberConnected(user)));
            connection.on('GameMemberDisconnectedAsync', (user: User) => emit(gameMemberDisconnected(user)));
            connection.on('NewVoteAsync', (v: VoteState) => emit(newVote(v)));
            connection.on('GameEndedAsync', (roleName: string) => emit(gameEnded(roleName)));
            connection.on('UpdateVotingResultAsync', (userId: string) => emit(votingResult(userId)));

            connection.onclose(error => {
                if (error) {
                    console.error('Game connection closed with an error', error);
                    toast.error('Utracono połączenie z grą');
                }

                emit(END);
            });

            return () => {
                connection.stop();
            };
        },
        buffers.expanding(),
    )
);

function* incomingActionsWatcher(channel: EventChannel<GameAction>) {
    while (true) {
        const action: GameAction = yield take(channel);
        yield put(action);
    }
}

function* invokeActionsWatcher(connection: HubConnection) {
    while (true) {
        const action: InvokeAction<string, GameAction> = yield take(
            (act: InvokeAction<any, any> | AnyAction) => act.isInvokeAction && act.hubClientName === gameHubClientName,
        );
        yield fork(invokeActionsWorker, action, connection);
    }
}

function* invokeActionsWorker(action: InvokeAction<string, GameAction>, connection: HubConnection) {
    try {
        yield apply(connection, connection.invoke, [action.methodName, ...Object.values(action.args || {})]);
    } catch (e) {
        console.error('Error has ocurred when invoking a hub method', e);
        toast.error(`Błąd podczas przewarzania akcji: ${e.message}`);
    }
}

export default {
    connectToGameWatcher,
};
