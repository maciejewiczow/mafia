import { debug } from 'console';
import { produce } from 'immer';
import { Action, Reducer } from 'redux';
import { objectHasOwnProperty } from '../utils';
import { ChatAction, ChatActionType } from './constants';
import { initialChatState, ChatsState } from './store';

export const chatsReducer: Reducer<ChatsState, ChatAction> = (
    state = initialChatState,
    action
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
                    if (objectHasOwnProperty(draft.chats, message.groupName)) {
                        draft.chats[message.groupName].messages.push(message);
                    }
                    else {
                        draft.chats[message.groupName] = {
                            messages: [message]
                        };
                    }
                }
            });

        default:
            return state;
    }
};