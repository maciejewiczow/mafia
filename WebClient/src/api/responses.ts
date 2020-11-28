export * from './generated';

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

export interface ObjectId {
    creationTime: string;
    increment: number;
    machine: number;
    pid: number;
    timestamp: number;
}

export interface GameState {
    id: string;
    userStates: UserState[];
    phase: PhaseEnum;
    voteState: VoteState[];
    votingStart: string;
}

export interface UserState {
    userId: string;
    role: RoleEnum;
}

export interface VoteState {
    userId: string;
    votedUserId: string;
}

export enum RoleEnum {
    mafioso = 1,
    ghost = 2,
    citizen = 4,
}

export enum PhaseEnum {
    night,
    day,
}

export interface GameOptions {
    maxPlayers: number;
    phaseTime: string;
    mafiosoCount: number;
    isPublic: boolean;
    visibleVotes: boolean;
}

export interface GameRoom {
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

export type RoomsResponse = RoomProjection[];
