import { GameOptions, GameRoom, RoomsResponse } from 'api';
import { RequestActionBundle, ResponseSuccessAction } from '../utils';

export enum RoomsActionType {
    roomsRequest = 'rooms/REQUEST',
    roomsRequestSuccess = 'rooms/REQUEST_SUCCESS',
    roomsRequestFailed = 'rooms/REQUEST_FAIL',
    createRoom = 'createRoom',
    createRoomRequest = 'createRoom/REQUEST',
    createRoomRequestSuccess = 'createRoom/REQUEST_SUCCESS',
    createRoomRequestFailed = 'createRoom/REQUEST_FAIL',
    joinRoom = 'joinRoom',
    joinRoomSuccess = 'joinRoom/SUCCESS',
    getCurrentRoom = 'getCurrentRoom',
    getCurrentRoomSuccess = 'getCurrentRoom/SUCCESS',
    updateRoomSettings = 'rooms/UPDATE_SETTINGS',
    saveRoomSettings = 'rooms/SAVE_SETTINGS',
}

export type RoomsAction =
    | RequestActionBundle<
          RoomsActionType.roomsRequest,
          RoomsActionType.roomsRequestSuccess,
          RoomsActionType.roomsRequestFailed,
          undefined,
          RoomsResponse
      >
    | RequestActionBundle<
          RoomsActionType.createRoomRequest,
          RoomsActionType.createRoomRequestSuccess,
          RoomsActionType.createRoomRequestFailed,
          undefined,
          GameRoom
      >
    | {
          type: RoomsActionType.createRoom;
          name: string;
      }
    | {
          type: RoomsActionType.joinRoom;
          roomId: string;
      }
    | {
          type: RoomsActionType.getCurrentRoom;
      }
    | ResponseSuccessAction<RoomsActionType.joinRoomSuccess, GameRoom>
    | ResponseSuccessAction<RoomsActionType.getCurrentRoomSuccess, GameRoom>
    | {
          type: RoomsActionType.updateRoomSettings;
          options: Partial<GameOptions>;
      }
    | {
          type: RoomsActionType.saveRoomSettings;
      };
