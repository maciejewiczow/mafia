import { GameRoom, RoomProjection } from '../../api';

export interface RoomsState {
    isLoading: boolean;
    roomList: RoomProjection[];
    currentRoom?: GameRoom;
}

export const initialRoomsState: RoomsState = {
    isLoading: false,
    roomList: []
};
