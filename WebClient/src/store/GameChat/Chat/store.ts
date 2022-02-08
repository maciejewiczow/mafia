import { ChatTypeEnum, Message } from '../../../api';

export type ChatsState = Record<string, ChatState>;

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

export const initialChatState: ChatsState = {};
