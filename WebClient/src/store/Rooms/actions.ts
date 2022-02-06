import { AxiosResponse } from 'axios';
import { GameOptions, GameRoom } from 'api';
import { PickAction } from 'store/utils';
import { RoomsAction, RoomsActionType } from './constants';

export const getRooms = (): PickAction<RoomsAction, RoomsActionType.roomsRequest> => ({
    type: RoomsActionType.roomsRequest,
    isRequestAction: true,
    payload: {
        request: {
            url: '/gameRooms',
        },
    },
});

export const createRoom = (name: string): PickAction<RoomsAction, RoomsActionType.createRoom> => ({
    type: RoomsActionType.createRoom,
    name,
});

export const getCurrentRoomSuccess = (payload: AxiosResponse<GameRoom>): PickAction<RoomsAction, RoomsActionType.getCurrentRoomSuccess> => ({
    type: RoomsActionType.getCurrentRoomSuccess,
    payload,
});

export const createRoomSuccess = (
    (payload: AxiosResponse<GameRoom>): PickAction<RoomsAction, RoomsActionType.createRoomRequestSuccess> => ({
        type: RoomsActionType.createRoomRequestSuccess,
        payload,
    })
);

export const joinRoomSuccess = (payload: AxiosResponse<GameRoom>): PickAction<RoomsAction, RoomsActionType.joinRoomSuccess> => ({
    type: RoomsActionType.joinRoomSuccess,
    payload,
});

export const joinRoom = (roomId: string): PickAction<RoomsAction, RoomsActionType.joinRoom> => ({
    type: RoomsActionType.joinRoom,
    roomId,
});

export const updateGameOptions = (options: Partial<GameOptions>): PickAction<RoomsAction, RoomsActionType.updateRoomSettings> => ({
    type: RoomsActionType.updateRoomSettings,
    options,
});

export const saveGameOptions = (): PickAction<RoomsAction, RoomsActionType.saveRoomSettings> => ({
    type: RoomsActionType.saveRoomSettings,
});
