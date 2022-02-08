import { ChatTypeEnum, Message } from 'api';
import { PickAction } from 'store/utils';
import { ChatAction, ChatActionType } from './constants';

export const sendMessage = (chatType: ChatTypeEnum, content: string): PickAction<ChatAction, ChatActionType.sendMessage> => ({
    type: ChatActionType.sendMessage,
    isInvokeAction: true,
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
