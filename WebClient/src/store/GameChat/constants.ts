import { User } from 'api';
import { InvokeAction } from 'store/utils';
import { AnnouncementMessage } from './Chat/store';

export enum GameChatActionType {
    connect = 'gameChat/CONNECT',
    connectSuccess = 'gameChat/CONNECT_SUCCESS',
    memberConnected = 'gameChat/MEMBER_CONNECTED',
    memberDisconnected= 'gameChat/MEMBER_DISCONNECTED',
    invokeAddMeToGroups = 'gameChat/ADD_ME_TO_GROUPS',
}

export type GameChatAction = {
    type: GameChatActionType.connect;
} | {
    type: GameChatActionType.connectSuccess;
} | {
    type: GameChatActionType.memberConnected;
    user: User;
    message: AnnouncementMessage;
} | {
    type: GameChatActionType.memberDisconnected;
    user: User;
    message: AnnouncementMessage;
} | (
    InvokeAction<GameChatActionType.invokeAddMeToGroups>
);
