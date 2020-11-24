import { AxiosResponse } from 'axios';
import { getAction } from 'connected-react-router';
import { ActionCreator } from 'redux';
import { GameRoom, RoomsResponse } from '../../api';
import { PickAction, RequestActionBundle, TypedActionCreator } from '../utils';

export enum RoomsActionType {
    roomsRequest = 'rooms/REQUEST',
    roomsRequestSuccess = 'rooms/REQUEST_SUCCESS',
    roomsRequestFailed = 'rooms/REQUEST_FAILED',
    createRoom = 'createRoom',
    createRoomRequest = 'createRoom/REQUEST',
    createRoomRequestSuccess = 'createRoom/REQUEST_SUCCESS',
    createRoomRequestFailed = 'createRoom/REQUEST_FAIL',
}

export type RoomsAction = RequestActionBundle<
    RoomsActionType.roomsRequest,
    RoomsActionType.roomsRequestSuccess,
    RoomsActionType.roomsRequestFailed,
    undefined,
    RoomsResponse
> | RequestActionBundle<
    RoomsActionType.createRoomRequest,
    RoomsActionType.createRoomRequestSuccess,
    RoomsActionType.createRoomRequestFailed,
    undefined,
    GameRoom
> | {
    type: RoomsActionType.createRoom;
    name: string;
}

export const getRooms: TypedActionCreator<RoomsAction, RoomsActionType.roomsRequest> = () => ({
    type: RoomsActionType.roomsRequest,
    isRequestAction: true,
    payload: {
        request: {
            url: '/GameRooms'
        }
    }
});

export const createRoom: TypedActionCreator<RoomsAction, RoomsActionType.createRoom> = (name: string) => ({
    type: RoomsActionType.createRoom,
    name
});

export const createRoomSuccess: TypedActionCreator<RoomsAction, RoomsActionType.createRoomRequestSuccess> = (
    (payload: AxiosResponse<GameRoom>) => ({
        type: RoomsActionType.createRoomRequestSuccess,
        payload
    })
);
