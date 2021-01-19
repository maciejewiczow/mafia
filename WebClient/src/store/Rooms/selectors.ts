import { AppState } from '../store';

export const areRoomsLoading = (store: AppState) => store.rooms.isRoomListLoading;

export const rooms = (store: AppState) => store.rooms.roomList;

export const currentRoom = (store: AppState) => store.rooms.currentRoom;

export const isCurrentRoomLoading = (store: AppState) => store.rooms.isCurrentRoomLoading;

export const hasCurrentGameStarted = (store: AppState) => store.rooms.currentRoom?.hasGameStarted;
