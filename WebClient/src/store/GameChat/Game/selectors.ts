import { User } from 'api';
import { AppState } from 'store';

export const userRoles = (userId: string) => (state: AppState) => {
    if (!state.gameChat.game?.userStates)
        return [];

    const role = state.gameChat.game.userStates.find(us => us.userId === userId)?.role || '';

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

export const currentGameState = (state: AppState) => state.gameChat.game;
