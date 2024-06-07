import { ChatTypeEnum, Message } from 'api';
import { InvokeAction } from 'store/utils';

export enum ChatActionType {
    sendMessage = 'chat/MESSAGE_SEND',
    receiveMessages = 'chat/MESSAGE_RECEIVE',
}

export type ChatAction =
    | {
          type: ChatActionType.receiveMessages;
          messages: Message[];
      }
    | InvokeAction<
          ChatActionType.sendMessage,
          [
              {
                  chatType: ChatTypeEnum;
                  content: string;
              },
          ]
      >;
