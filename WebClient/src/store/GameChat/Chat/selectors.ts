import { ChatTypeEnum } from 'api';
import { AppState } from '../../constants';
import { AnnouncementMessage, DefaultMessage, MessageType } from './store';

export interface DefaultMessageWithUserName extends DefaultMessage {
    userName?: string;
}

export type MessageInStoreWithUserName = (DefaultMessageWithUserName | AnnouncementMessage);

export const chatMessages = (chatType: ChatTypeEnum) => (state: AppState): MessageInStoreWithUserName[] | undefined => {
    if (!state.currentUser.user?.roomId) { return undefined; }

    const messages = state.gameChat.chats[chatType]?.messages.map(mess => {
        if (mess.messageType === MessageType.Announcement) { return mess; }

        const authorWithName = state.rooms.currentRoom?.participantsWithNames.find(participant => participant.id === mess.userId);
        return {
            ...mess,
            userName: authorWithName?.name,
        };
    });

    return messages;
};
