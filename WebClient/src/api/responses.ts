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
    gameHistory: GameState[];
    currentGameStateId: string;
    name: string;
    password: string;
    gameOptions: GameOptions;
    owner: string;
    groupName: string;
    participants: string[];
    participantsWithNames: User[];
    isGameStarted: boolean;
    isGameEnded: boolean;
}

export type RoomsResponse = GameRoomProjection[];
