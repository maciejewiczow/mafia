import { ChatTypeEnum } from 'api';
import { produce } from 'immer';
import { Reducer } from 'redux';
import { objectHasOwnProperty, PickAction } from 'store/utils';
import { ChatAction, ChatActionType } from './constants';
import { initialChatState, ChatsState, MessageType, MessageInStore } from './store';

export const chatsReducer: Reducer<ChatsState, ChatAction> = (
    state = initialChatState,
    action,
) => {
    switch (action.type) {
        case ChatActionType.connectToChat:
            return produce(state, draft => {
                draft.isConnected = false;
                draft.isConnecting = true;
            });

        case ChatActionType.connectToChatSuccess:
            return produce(state, draft => {
                draft.isConnected = true;
                draft.isConnecting = false;
            });

        case ChatActionType.recieveMessages:
            return produce(state, draft => {
                for (const message of action.messages) {
                    const insertMe: MessageInStore = {
                        ...message,
                        messageType: MessageType.Default,
                    };
                    if (objectHasOwnProperty(draft.chats, message.chatType)) {
                        draft.chats[message.chatType].messages.push(insertMe);
                    } else {
                        draft.chats[message.chatType] = {
                            messages: [insertMe],
                        };
                    }
                }
            });

        case ChatActionType.memberConnected:
            return produce(state, draft => {
                const insertMe: Extract<MessageInStore, { messageType: MessageType.Announcement }> = {
                    messageType: MessageType.Announcement,
                    content: `${action.user.name} dołączył do chatu`,
                    sentAt: new Date().toUTCString(),
                    // API-FIX: Wysyłać typ chatu w OnConnectedAsync
                    chatType: ChatTypeEnum.General,
                    id: Math.random().toString(),
                };

                if (objectHasOwnProperty(draft.chats, insertMe.chatType)) {
                    draft.chats[insertMe.chatType].messages.push(insertMe);
                } else {
                    draft.chats[insertMe.chatType] = {
                        messages: [insertMe],
                    };
                }
            });

        case ChatActionType.memberDisconnected:
            return produce(state, draft => {
                const insertMe: Extract<MessageInStore, { messageType: MessageType.Announcement }> = {
                    messageType: MessageType.Announcement,
                    // API-FIX: wysyłać całego usera w OnDisconnectedAsync
                    content: `${action.userId} opuścił chat`,
                    sentAt: new Date().toUTCString(),
                    // API-FIX: Wysyłać typ chatu w OnConnectedAsync
                    chatType: ChatTypeEnum.General,
                    id: Math.random().toString(),
                };

                if (objectHasOwnProperty(draft.chats, insertMe.chatType)) {
                    draft.chats[insertMe.chatType].messages.push(insertMe);
                } else {
                    draft.chats[insertMe.chatType] = {
                        messages: [insertMe],
                    };
                }
            });

        default:
            return state;
    }
};
