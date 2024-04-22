import { toast } from 'react-toastify';
import {
    HubConnection,
    HubConnectionBuilder,
    LogLevel,
} from '@microsoft/signalr';
import {
    ChatTypeEnum,
    GameState,
    getAccessToken,
    Message,
    User,
    VoteState,
} from 'api';
import { AnyAction } from 'redux';
import { buffers, END, EventChannel, eventChannel } from 'redux-saga';
import { apply, call, fork, put, take, takeLatest } from 'redux-saga/effects';
import { messageRecieved } from 'store/GameChat/Chat/actions';
import { ChatAction } from 'store/GameChat/Chat/constants';
import {
    InvokeAction,
    InvokeActionError,
    InvokeActionSuccess,
} from 'store/utils';
import {
    callAddMeToGhostGroup,
    connectToGameChatSuccess,
    invokeAddMeToGhostGroup,
    memberConnected,
    memberDisconnected,
} from './actions';
import { GameChatAction, GameChatActionType } from './constants';
import {
    gameEnded,
    gameStarted,
    newVote,
    stateUpdate,
    votingResult,
} from './Game/actions';
import { GameAction } from './Game/constants';

const subscribe = (connection: HubConnection) => eventChannel<GameAction | ChatAction | GameChatAction>(emit => {
    connection.on('UpdateGameStateAsync', (state: GameState) => {
        emit(stateUpdate(state));
    });
    connection.on('NewVoteAsync', (v: VoteState) => {
        emit(newVote(v));
    });
    connection.on('GameEndedAsync', (roleName: string) => {
        emit(gameEnded(roleName));
    });
    connection.on('UpdateVotingResultAsync', (userId: string) => {
        emit(votingResult(userId));
    });
    connection.on('GameStartedAsync', () => {
        emit(gameStarted());
    });
    connection.on('MessageAsync', (m: Message) => {
        emit(messageRecieved([m]));
    });
    connection.on('MessagesOnConnectedAsync', (m: Message[]) => {
        emit(messageRecieved(m));
    });
    connection.on(
        'UserConnectedAsync',
        (user: User, chatType: ChatTypeEnum) => {
            emit(memberConnected(user, chatType));
        },
    );
    connection.on(
        'UserDisconnectedAsync',
        (user: User, chatType: ChatTypeEnum) => {
            emit(memberDisconnected(user, chatType));
        },
    );
    connection.on('CallAddToGhostGroup', () => {
        emit(callAddMeToGhostGroup());
    });

    connection.onclose(error => {
        if (error) {
            console.error('Game connection closed with an error', error);
            toast.error('Utracono połączenie z serwerem');
        }

        emit(END);
    });

    return () => {
        connection.stop();
    };
}, buffers.expanding());

function* connectToGameChatWatcher() {
    yield takeLatest(GameChatActionType.connect, connectToGameChatWorker);
}

const getTokenOrThrow = async () => {
    const token = await getAccessToken();

    if (!token) {
        throw new Error('Cannot connect to game without token');
    }

    return token;
};

function* connectToGameChatWorker() {
    try {
        const connection = new HubConnectionBuilder()
            .withUrl('http://localhost:5000/hubs/gameChat', {
                accessTokenFactory: getTokenOrThrow,
            })
            .configureLogging(LogLevel.Information)
            .build();

        const channel: ReturnType<typeof subscribe> = yield call(
            subscribe,
            connection,
        );

        yield fork(incomingActionsWatcher, channel);
        yield fork(invokeActionsWatcher, connection);
        yield apply(connection, connection.start, []);
        yield put(connectToGameChatSuccess());
    } catch (error) {
        console.error('Game error:', error);
        if (error instanceof Error) {
            toast.error(`Błąd gry: ${error.message}`);
        }
    }
}

function* incomingActionsWatcher(
    channel: EventChannel<GameAction | ChatAction | GameChatAction>,
) {
    while (true) {
        const action: GameAction = yield take(channel);
        console.log('Incoming server action', action);
        yield put(action);
    }
}

function* invokeActionsWatcher(connection: HubConnection) {
    while (true) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const action: InvokeAction<string, any[], string, string> = yield take(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (act: InvokeAction<any, any> | AnyAction) => act.isInvokeAction,
        );
        console.log('Outgoing client action', action);
        yield fork(invokeActionsWorker, action, connection);
    }
}

function* invokeActionsWorker(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    action: InvokeAction<string, any[], string, string>,
    connection: HubConnection,
) {
    try {
        // @ts-expect-error this actually should be any
        const result = yield apply(connection, connection.invoke, [
            action.methodName,
            ...(action.args || []),
        ]);

        if (action.successActionType) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const sucessAction: InvokeActionSuccess<string, any> = {
                type: action.successActionType,
                result,
            };
            yield put(sucessAction);
        }
    } catch (error) {
        if (action.errorActionType && error instanceof Error) {
            const errorAction: InvokeActionError<string> = {
                type: action.errorActionType,
                error,
            };
            yield put(errorAction);
        }
        console.error('Error has ocurred when invoking a hub method', error);
        if (error instanceof Error) {
            toast.error(`Błąd podczas przewarzania akcji: ${error.message}`);
        }
    }
}

function* addMeToGhostGroupWatcher() {
    yield takeLatest(
        GameChatActionType.callAddMeToGhostGroup,
        addMeToGhostGroupWorker,
    );
}

function* addMeToGhostGroupWorker() {
    yield put(invokeAddMeToGhostGroup());
}

export default {
    connectToGameChatWatcher,
    addMeToGhostGroupWatcher,
};
