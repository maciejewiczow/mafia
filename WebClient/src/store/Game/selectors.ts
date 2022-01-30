import { User } from 'api';
import { AppState } from 'store';

export const isConnectedToGame = (state: AppState) => state.game.isConnected;

export const isConnectingToGame = (state: AppState) => state.game.isConnecting;

export const userRoles = (userId: string) => (state: AppState) => {
    if (!state.game.currentGameState?.userStates)
        return [];

    const role = state.game.currentGameState.userStates.find(us => us.userId === userId)?.role || '';

    return role.split(',').map(r => r.trim());
};

export interface ParticipantWithNameAndRole extends User {
    roles: string[];
}

export const participantsWithNamesAndRoles = (state: AppState): ParticipantWithNameAndRole[] | undefined => (
    state.rooms.currentRoom?.participantsWithNames.map(participant => ({
        ...participant,
        roles: userRoles(participant.id)(state),
    }))
);

export const currentGameState = (state: AppState) => state.game.currentGameState;
