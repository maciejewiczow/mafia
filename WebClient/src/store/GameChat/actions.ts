import { ChatTypeEnum, User } from 'api';
import { PickAction } from 'store';
import { MessageType } from './Chat/store';
import { GameChatAction, GameChatActionType } from './constants';

export const memberConnected = (user: User): PickAction<GameChatAction, GameChatActionType.memberConnected> => ({
    type: GameChatActionType.memberConnected,
    user,
    message: {
        messageType: MessageType.Announcement,
        content: `${user.name} dołączył do chatu`,
        sentAt: new Date().toUTCString(),
        // API-FIX: Wysyłać typ chatu w OnConnectedAsync
        chatType: ChatTypeEnum.General,
        id: Math.random().toString(),
    },
});

export const memberDisconnected = (user: User): PickAction<GameChatAction, GameChatActionType.memberDisconnected> => ({
    type: GameChatActionType.memberDisconnected,
    user,
    message: {
        messageType: MessageType.Announcement,
        content: `${user.name} opuścił chat`,
        sentAt: new Date().toUTCString(),
        // API-FIX: Wysyłać typ chatu w OnDisconnectedConnectedAsync
        chatType: ChatTypeEnum.General,
        id: Math.random().toString(),
    },
});

export const invokeAddMeToGroups = (): PickAction<GameChatAction, GameChatActionType.invokeAddMeToGroups> => ({
    type: GameChatActionType.invokeAddMeToGroups,
    successActionType: undefined,
    errorActionType: undefined,
    isInvokeAction: true,
    methodName: 'AddMeToGroupsOnGameStart',
    args: undefined,
});

export const connectToGameChat = (): PickAction<GameChatAction, GameChatActionType.connect> => ({
    type: GameChatActionType.connect,
});

export const connectToGameChatSuccess = (): PickAction<GameChatAction, GameChatActionType.connectSuccess> => ({
    type: GameChatActionType.connectSuccess,
});
