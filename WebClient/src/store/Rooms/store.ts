import { GameRoom, GameRoomProjection } from 'api';

export interface RoomsState {
    isRoomListLoading: boolean;
    roomList: GameRoomProjection[];
    isCurrentRoomLoading: boolean;
    currentRoom?: GameRoom & { winnerRole?: string };
}

export const initialRoomsState: RoomsState = {
    isRoomListLoading: false,
    isCurrentRoomLoading: false,
    roomList: [],
};
