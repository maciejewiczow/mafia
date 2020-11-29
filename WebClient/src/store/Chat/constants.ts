import { ChatTypeEnum, Message, User } from 'api';
import { InvokeAction } from 'store/utils';

export enum ChatActionType {
    connectToChat = 'chat/CONNECT',
    connectToChatSuccess = 'chat/CONNECT_SUCCESS',
    sendMessage = 'chat/MESSAGE_SEND',
    recieveMessages = 'chat/MESSAGE_RECIEVE',
    memberConnected = 'chat/MEMBER_CONNECTED',
    memberDisconnected= 'chat/MEMBER_DISCONNECTED',
}

export interface InvokeAction<T extends string, P> {
    type: T;
    isInvokeAction: true;
    methodName: string;
    args: P;
}

export type ChatAction = {
    type: ChatActionType.connectToChat;
} | {
    type: ChatActionType.connectToChatSuccess;
} | {
    type: ChatActionType.recieveMessages;
    messages: Message[];
} | InvokeAction<
    ChatActionType.sendMessage,
    {
        sendMessageDTO: {
        chatType: ChatTypeEnum;
        content: string;
        };
    }
> | {
    type: ChatActionType.memberConnected;
    user: User;
} | {
    type: ChatActionType.memberDisconnected;
    userId: string;
}
