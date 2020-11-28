import { AppState } from '../store';

export const areRoomsLoading = (store: AppState) => store.rooms.isLoading;

export const rooms = (store: AppState) => store.rooms.roomList;

export const currentRoom = (store: AppState) => store.rooms.currentRoom;
