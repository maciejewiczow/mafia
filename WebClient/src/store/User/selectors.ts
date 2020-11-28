import { AppState } from '..';

export const isUserLoading = (state: AppState) => state.currentUser.isLoading;

export const currentUser = (state: AppState) => state.currentUser.user;

export const currentUserRoom = (state: AppState) => state.currentUser?.user?.roomId;
