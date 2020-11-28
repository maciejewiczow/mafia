import { Message } from '../../api';

export interface ChatsState {
    isConnected: boolean;
    isConnecting: boolean;
    chats: Record<string, ChatState>;
}

interface ChatState {
    messages: Message[];
}

export const initialChatState: ChatsState = {
    isConnected: false,
    isConnecting: false,
    chats: {}
};
