import { ChatTypeEnum, Message } from '../../api';

export interface ChatsState {
    isConnected: boolean;
    isConnecting: boolean;
    chats: Record<string, ChatState>;
}

export enum MessageType {
    Default,
    Announcement,
}

export interface DefaultMessage extends Message {
    messageType: MessageType.Default;
}

export type MessageInStore = DefaultMessage | AnnouncementMessage;

export interface AnnouncementMessage {
    id: string;
    sentAt: string;
    content: string;
    chatType: ChatTypeEnum;
    messageType: MessageType.Announcement;
}

interface ChatState {
    messages: MessageInStore[];
}

export const initialChatState: ChatsState = {
    isConnected: false,
    isConnecting: false,
    chats: {},
};
