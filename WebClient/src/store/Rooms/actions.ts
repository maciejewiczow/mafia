import { AxiosResponse } from 'axios';
import { GameRoom } from 'api';
import { PickAction } from 'store/utils';
import { RoomsAction, RoomsActionType } from './constants';

export const getRooms = (): PickAction<RoomsAction, RoomsActionType.roomsRequest> => ({
    type: RoomsActionType.roomsRequest,
    isRequestAction: true,
    payload: {
        request: {
            url: '/GameRooms',
        },
    },
});

export const createRoom = (name: string): PickAction<RoomsAction, RoomsActionType.createRoom> => ({
    type: RoomsActionType.createRoom,
    name,
});

export const joinRoomSuccess = (
    (payload: AxiosResponse<GameRoom>): PickAction<RoomsAction, RoomsActionType.joinRoomRequestSuccess> => ({
        type: RoomsActionType.joinRoomRequestSuccess,
        payload,
    })
);

export const joinRoom = (roomId: string): PickAction<RoomsAction, RoomsActionType.joinRoom> => ({
    type: RoomsActionType.joinRoom,
    roomId,
});
