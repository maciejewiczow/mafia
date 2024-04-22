import { produce } from 'immer';
import { Reducer } from 'redux';
import { objectHasOwnProperty } from 'store/utils';
import { GameChatAction, GameChatActionType } from '../constants';
import { ChatAction, ChatActionType } from './constants';
import { ChatsState, initialChatState, MessageInStore, MessageType } from './store';

export const chatsReducer: Reducer<ChatsState, ChatAction | GameChatAction> = (
    state = initialChatState,
    action,
) => {
    switch (action.type) {
        case ChatActionType.recieveMessages:
            return produce(state, draft => {
                for (const message of action.messages) {
                    const insertMe: MessageInStore = {
                        ...message,
                        messageType: MessageType.Default,
                    };
                    if (objectHasOwnProperty(draft, message.chatType)) {
                        draft[message.chatType].messages.push(insertMe);
                    } else {
                        draft[message.chatType] = {
                            messages: [insertMe],
                        };
                    }
                }
            });

        case GameChatActionType.memberConnected:
            return produce(state, draft => {
                const insertMe = action.message;

                if (objectHasOwnProperty(draft, insertMe.chatType)) {
                    draft[insertMe.chatType].messages.push(insertMe);
                } else {
                    draft[insertMe.chatType] = {
                        messages: [insertMe],
                    };
                }
            });

        case GameChatActionType.memberDisconnected:
            return produce(state, draft => {
                const insertMe = action.message;

                if (objectHasOwnProperty(draft, insertMe.chatType)) {
                    draft[insertMe.chatType].messages.push(insertMe);
                } else {
                    draft[insertMe.chatType] = {
                        messages: [insertMe],
                    };
                }
            });

        default:
            return state;
    }
};
