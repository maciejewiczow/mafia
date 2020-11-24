import { GameRoom, RoomsResponse } from '../../api';
import { RequestActionBundle } from '../utils';

export enum RoomsActionType {
    roomsRequest = 'rooms/REQUEST',
    roomsRequestSuccess = 'rooms/REQUEST_SUCCESS',
    roomsRequestFailed = 'rooms/REQUEST_FAILED',
    createRoom = 'createRoom',
    createRoomRequest = 'createRoom/REQUEST',
    joinRoomRequestSuccess = 'createRoom/REQUEST_SUCCESS',
    createRoomRequestFailed = 'createRoom/REQUEST_FAIL',
    joinRoom = 'joinRoom',
}

export type RoomsAction = RequestActionBundle<
    RoomsActionType.roomsRequest,
    RoomsActionType.roomsRequestSuccess,
    RoomsActionType.roomsRequestFailed,
    undefined,
    RoomsResponse
> | RequestActionBundle<
    RoomsActionType.createRoomRequest,
    RoomsActionType.joinRoomRequestSuccess,
    RoomsActionType.createRoomRequestFailed,
    undefined,
    GameRoom
> | {
    type: RoomsActionType.createRoom;
    name: string;
} | {
    type: RoomsActionType.joinRoom;
    roomId: string;
}
