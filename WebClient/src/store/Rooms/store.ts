import { RoomProjection } from '../../api';

export interface RoomsState {
    isLoading: boolean;
    roomList: RoomProjection[];
}

export const initialRoomsState: RoomsState = {
    isLoading: false,
    roomList: []
};
