import {
    call,
    take,
    fork,
    takeLatest,
    apply,
    put,
} from 'redux-saga/effects';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { buffers, END, EventChannel, eventChannel } from 'redux-saga';
import { AnyAction } from 'redux';
import { toast } from 'react-toastify';
import { getAccessToken } from 'api/tokens';
import { InvokeAction, InvokeActionError, InvokeActionSuccess } from 'store/utils';
import { GameState, User, VoteState } from 'api';
import { GameAction, GameActionType, gameHubClientName } from '../constants';
import {
    connectToGameSuccess,
    gameEnded,
    gameMemberConnected,
    gameMemberDisconnected,
    gameStarted,
    newVote,
    stateUpdate,
    votingResult,
} from '../actions';

const subscribe = (connection: HubConnection) => (
    eventChannel<GameAction>(
        emit => {
            connection.on('UpdateGameStateAsync', (state: GameState) => emit(stateUpdate(state)));
            connection.on('GameMemberConnectedAsync', (user: User) => emit(gameMemberConnected(user)));
            connection.on('GameMemberDisconnectedAsync', (user: User) => emit(gameMemberDisconnected(user)));
            connection.on('NewVoteAsync', (v: VoteState) => emit(newVote(v)));
            connection.on('GameEndedAsync', (roleName: string) => emit(gameEnded(roleName)));
            connection.on('UpdateVotingResultAsync', (userId: string) => emit(votingResult(userId)));
            connection.on('GameStartedAsync', () => emit(gameStarted()));

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

function* incomingActionsWatcher(channel: EventChannel<GameAction>) {
    while (true) {
        const action: GameAction = yield take(channel);
        yield put(action);
    }
}

function* invokeActionsWatcher(connection: HubConnection) {
    while (true) {
        const action: InvokeAction<string, any[], string, string> = yield take(
            (act: InvokeAction<any, any> | AnyAction) => act.isInvokeAction && act.hubClientName === gameHubClientName,
        );
        yield fork(invokeActionsWorker, action, connection);
    }
}

function* invokeActionsWorker(action: InvokeAction<string, any[], string, string>, connection: HubConnection) {
    try {
        const result = yield apply(connection, connection.invoke, [action.methodName, ...(action.args || [])]);

        if (action.successActionType) {
            const sucessAction: InvokeActionSuccess<string, any> = {
                type: action.successActionType,
                result,
            };
            yield put(sucessAction);
        }
    } catch (error) {
        if (action.errorActionType) {
            const sucessAction: InvokeActionError<string> = {
                type: action.errorActionType,
                error,
            };
            yield put(sucessAction);
        }
        console.error('Error has ocurred when invoking a hub method', error);
        toast.error(`Błąd podczas przewarzania akcji: ${error.message}`);
    }
}

export default {
    connectToGameWatcher,
};
