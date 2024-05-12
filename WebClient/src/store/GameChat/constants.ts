import { User } from 'api';
import { InvokeAction } from 'store/utils';
import { AnnouncementMessage } from './Chat/store';

export enum GameChatActionType {
    connect = 'gameChat/CONNECT',
    connectSuccess = 'gameChat/CONNECT_SUCCESS',
    memberConnected = 'gameChat/MEMBER_CONNECTED',
    memberDisconnected = 'gameChat/MEMBER_DISCONNECTED',
    invokeAddMeToGroups = 'gameChat/ADD_ME_TO_GROUPS',
    callAddMeToGhostGroup = 'gameChat/CALL_ADD_ME_TO_GHOST_GROUP',
    invokeAddMeToGhostGroup = 'gameChat/INVOKE_ADD_ME_TO_GHOST_GROUP',
}

export type GameChatAction =
    | {
          type: GameChatActionType.connect;
      }
    | {
          type: GameChatActionType.connectSuccess;
      }
    | {
          type: GameChatActionType.memberConnected;
          user: User;
          message: AnnouncementMessage;
      }
    | {
          type: GameChatActionType.memberDisconnected;
          user: User;
          message: AnnouncementMessage;
      }
    | InvokeAction<GameChatActionType.invokeAddMeToGroups>
    | {
          type: GameChatActionType.callAddMeToGhostGroup;
      }
    | InvokeAction<GameChatActionType.invokeAddMeToGhostGroup>;
