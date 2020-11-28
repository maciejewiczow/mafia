import { ChatTypeEnum, Message } from '../../api';
import { TypedActionCreator } from '../utils';
import { ChatAction, ChatActionType } from './constants';

export const connectToChat: TypedActionCreator<ChatAction, ChatActionType.connectToChat> = () => ({
    type: ChatActionType.connectToChat
});

export const connetToChatSuccess: TypedActionCreator<ChatAction, ChatActionType.connectToChatSuccess> = () => ({
    type: ChatActionType.connectToChatSuccess
});

export const sendMessage: TypedActionCreator<ChatAction, ChatActionType.sendMessage> = (chatType: ChatTypeEnum, content: string) => ({
    type: ChatActionType.sendMessage,
    isInvokeAction: true,
    methodName: 'SendMessage',
    args: {
        content,
        chatType
    }
});

export const messageRecieved: TypedActionCreator<ChatAction, ChatActionType.recieveMessages> = (messages: Message[]) => ({
    type: ChatActionType.recieveMessages,
    messages
});
