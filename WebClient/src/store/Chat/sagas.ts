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
import { Message, User } from 'api';
import { getAccessToken } from 'api/tokens';
import { InvokeAction, InvokeActionError, InvokeActionSuccess } from 'store/utils';
import { AnyAction } from 'redux';
import { toast } from 'react-toastify';
import { connetToChatSuccess, memberConnected, memberDisconnected, messageRecieved } from './actions';
import { ChatAction, ChatActionType, chatHubClientName } from './constants';

// TODO: remove code duplication with Game sagas. One set of sagas to handle all hub clients

const subscribe = (connection: HubConnection) => (
    eventChannel<ChatAction>(
        emit => {
            connection.on('MessageAsync', (m: Message) => {
                emit(messageRecieved([m]));
            });

            connection.on('MessagesOnConnectedAsync', (m: Message[]) => {
                emit(messageRecieved(m));
            });

            connection.on('UserConnectedAsync', (user: User) => {
                emit(memberConnected(user));
            });

            connection.on('UserDisconnectedAsync', (userId: string) => {
                emit(memberDisconnected(userId));
            });

            connection.onclose(error => {
                if (error) {
                    console.error('Chat connection closed with an error', error);
                    toast.error('Utracono połączenie z chatem');
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

function* connectToChatWatcher() {
    yield takeLatest(ChatActionType.connectToChat, connectToChatWorker);
}

const getTokenOrThrow = async () => {
    const token = await getAccessToken();

    if (!token)
        throw new Error('Cannot connect to chat without token');

    return token;
};

function* connectToChatWorker() {
    try {
        const chatConnection = new HubConnectionBuilder()
            .withUrl('http://localhost:5000/hubs/chat', { accessTokenFactory: getTokenOrThrow })
            .configureLogging(LogLevel.Information)
            .build();

        const channel: ReturnType<typeof subscribe> = yield call(subscribe, chatConnection);

        yield fork(incomingActionsWatcher, channel);
        yield fork(invokeActionsWatcher, chatConnection);
        yield apply(chatConnection, chatConnection.start, []);
        yield put(connetToChatSuccess());
    } catch (error) {
        console.error('Chat error:', error);
        toast.error(`Błąd chatu: ${error.message}`);
    }
}

function* incomingActionsWatcher(channel: EventChannel<ChatAction>) {
    while (true) {
        const action: ChatAction = yield take(channel);
        yield put(action);
    }
}

function* invokeActionsWatcher(connection: HubConnection) {
    while (true) {
        const action: InvokeAction<string, any[], string, string> = yield take(
            (act: InvokeAction<any, any> | AnyAction) => act.isInvokeAction && act.hubClientName === chatHubClientName,
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
    connectToChatWatcher,
};
