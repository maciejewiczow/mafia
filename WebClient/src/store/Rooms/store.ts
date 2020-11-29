import { GameRoom, GameRoomProjection } from 'api';

export interface RoomsState {
    isLoading: boolean;
    roomList: GameRoomProjection[];
    currentRoom?: GameRoom;
}

export const initialRoomsState: RoomsState = {
    isLoading: false,
    roomList: [],
};
