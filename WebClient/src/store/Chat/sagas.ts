import { call, take, fork, takeLatest, apply, put } from 'redux-saga/effects';
import { ChatAction, ChatActionType } from './constants';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { buffers, END, EventChannel, eventChannel } from 'redux-saga';
import { Message, User } from 'api';
import { getAccessToken } from 'api/tokens';
import { InvokeAction } from 'store/utils';
import { AnyAction } from 'redux';
import { connetToChatSuccess,
    memberConnected,
    memberDisconnected,
    messageRecieved,
} from './actions';

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
            .withUrl('http://localhost:5000/hubs/chat', { accessTokenFactory:  getTokenOrThrow })
            .configureLogging(LogLevel.Information)
            .build();

        const channel: ReturnType<typeof subscribe> = yield call(subscribe, chatConnection);

        yield fork(incomingActionsWatcher, channel);
        yield fork(invokeActionsWatcher, chatConnection);
        yield apply(chatConnection, chatConnection.start, []);
        yield put(connetToChatSuccess());
    } catch (error) {
        console.error('Chat error:', error);
    }
}

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
                console.log('New user connected to chat: ', user);
            });

            connection.on('UserDisconnectedAsync', (userId: string) => {
                console.log(`Chat member ${userId} disconnected`);
            });

            connection.onclose(error => {
                if (error)
                    console.error('Chat connection closed with an error', error);

                emit(END);
            });

            return () => {
                connection.stop();
            };
        },
        buffers.expanding()
    )
);

function* incomingActionsWatcher(channel: EventChannel<ChatAction>) {
    while (true) {
        const action: ChatAction = yield take(channel);
        yield put(action);
    }
}

function* invokeActionsWatcher(connection: HubConnection) {
    while (true) {
        const action: InvokeAction<string, ChatAction> = yield take((act: InvokeAction<any, any> | AnyAction) => act.isInvokeAction);
        yield fork(invokeActionsWorker, action, connection);
    }
}

function* invokeActionsWorker(action: InvokeAction<string, ChatAction>, connection: HubConnection) {
    try {
        yield apply(
            connection,
            connection.invoke,
            [action.methodName, ...Object.values(action.args || {})]
        );
    } catch (e) {
        console.error('Error has ocurred when invoking a hub method', e);
    }
}

export default {
    connectToChatWatcher,
};
