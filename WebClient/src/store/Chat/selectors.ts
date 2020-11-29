import { ChatTypeEnum } from '../../api';
import { AppState } from '../store';

// FIXME: add re-select, because this selector causes constant chat rerenders
export const chatMessages = (chatType: ChatTypeEnum) => (state: AppState) => {
    if (!state.currentUser.user?.roomId)
        return undefined;


    const messages = state.chats.chats[chatType]?.messages.map(mess => {
        const authorWithName = state.rooms.currentRoom?.participantsWithNames.find(participant => participant.id === mess.userId);
        return {
            ...mess,
            userName: authorWithName?.name,
        };
    });

    return messages;
};

export const isConnectedToChat = (state: AppState) => state.chats.isConnected;

export const isConnectingToChat = (state: AppState) => state.chats.isConnecting;
