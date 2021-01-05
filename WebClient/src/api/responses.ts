import { GameOptions, GameRoomProjection, GameState, User } from './generated';

export * from './generated';

export interface CreateUserResponse {
    token: string;
    refreshToken: string;
    expiresOn: string;
}

export interface ObjectId {
    creationTime: string;
    increment: number;
    machine: number;
    pid: number;
    timestamp: number;
}

export interface GameRoom {
    id: string;
    currentGameState: GameState;
    name: string;
    password: string;
    gameOptions: GameOptions;
    owner: string;
    participants: string[];
    participantsWithNames: User[];
    hasGameStarted: boolean;
    hasGameEnded: boolean;
}

export type RoomsResponse = GameRoomProjection[];
