import { AxiosResponse } from 'axios';
import { GameRoom } from 'api';
import { RoomsAction, RoomsActionType } from './constants';

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

export const joinRoomSuccess: TypedActionCreator<RoomsAction, RoomsActionType.joinRoomRequestSuccess> = (
    (payload: AxiosResponse<GameRoom>) => ({
        type: RoomsActionType.joinRoomRequestSuccess,
        payload
    })
);

export const joinRoom: TypedActionCreator<RoomsAction, RoomsActionType.joinRoom> = (roomId: string) => ({
    type: RoomsActionType.joinRoom,
    roomId
});
