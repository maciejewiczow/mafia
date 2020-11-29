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

export type MessageInStore = (Message & {
    messageType: MessageType.Default;
}) | {
    id: string;
    sentAt: string;
    content: string;
    messageType: MessageType.Announcement;
    chatType: ChatTypeEnum;
}

interface ChatState {
    messages: MessageInStore[];
}

export const initialChatState: ChatsState = {
    isConnected: false,
    isConnecting: false,
    chats: {},
};
