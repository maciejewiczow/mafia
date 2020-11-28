import { ChatTypeEnum } from '../../api';
import { AppState } from '../store';

export const chatMessages = (chatType: ChatTypeEnum) => (state: AppState) => {
    if (!state.currentUser.user?.roomId)
        return undefined;

    const groupName = state.currentUser.user.roomId + chatType;

    const messages = state.chats.chats[groupName]?.messages.map(mess => {
        const authorWithName = state.rooms.currentRoom?.participantsWithNames.find(participant => participant.id === mess.userId);
        return {
            ...mess,
            userName: authorWithName?.name
        };
    });

    return messages;
};

export const isConnectedToChat = (state: AppState) => state.chats.isConnected;

export const isConnectingToChat = (state: AppState) => state.chats.isConnecting;
