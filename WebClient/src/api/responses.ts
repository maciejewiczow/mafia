
export interface TokenResponse {
    token: string;
    expiresOn: string;
}

export interface CreateUserResponse {
    token: string;
    refreshToken: string;
    expiresOn: string;
}

export interface RoomProjection {
    id: string;
    name: string;
    isGameStarted: boolean;
    maxPlayers: number;
    currentPlayersCount: number;
}

export interface User {
    id: string;
    name: string;
    roomId?: string;
}

export type RoomsResponse = RoomProjection[];
