import { ChatTypeEnum, Message } from 'api';
import { InvokeAction } from 'store/utils';

export enum ChatActionType {
    sendMessage = 'chat/MESSAGE_SEND',
    recieveMessages = 'chat/MESSAGE_RECIEVE',
}

export type ChatAction =
    | {
          type: ChatActionType.recieveMessages;
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
