import { ChatTypeEnum, Message } from 'api';
import { PickAction } from 'store/utils';
import { ChatAction, ChatActionType } from './constants';

export const sendMessage = (
    chatType: ChatTypeEnum,
    content: string,
): PickAction<ChatAction, ChatActionType.sendMessage> => ({
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

export const messageReceived = (
    messages: Message[],
): PickAction<ChatAction, ChatActionType.receiveMessages> => ({
    type: ChatActionType.receiveMessages,
    messages,
});
