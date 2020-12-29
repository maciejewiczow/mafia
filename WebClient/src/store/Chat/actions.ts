import { ChatTypeEnum, Message, User } from 'api';
import { PickAction } from 'store/utils';
import { ChatAction, ChatActionType, chatHubClientName } from './constants';

export const connectToChat = (): PickAction<ChatAction, ChatActionType.connectToChat> => ({
    type: ChatActionType.connectToChat,
});

export const connetToChatSuccess = (): PickAction<ChatAction, ChatActionType.connectToChatSuccess> => ({
    type: ChatActionType.connectToChatSuccess,
});

export const sendMessage = (chatType: ChatTypeEnum, content: string): PickAction<ChatAction, ChatActionType.sendMessage> => ({
    type: ChatActionType.sendMessage,
    isInvokeAction: true,
    hubClientName: chatHubClientName,
    successActionType: undefined,
    errorActionType: undefined,
    methodName: 'SendMessage',
    args: [
        {
            content,
            chatType,
        },
    ],
});

export const messageRecieved = (messages: Message[]): PickAction<ChatAction, ChatActionType.recieveMessages> => ({
    type: ChatActionType.recieveMessages,
    messages,
});

export const memberConnected = (user: User): PickAction<ChatAction, ChatActionType.memberConnected> => ({
    type: ChatActionType.memberConnected,
    user,
});

export const memberDisconnected = (userId: string): PickAction<ChatAction, ChatActionType.memberDisconnected> => ({
    type: ChatActionType.memberDisconnected,
    userId,
});
