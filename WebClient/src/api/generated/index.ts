export enum ChatTypeEnum {
    General = 'General',
    Mafia = 'Mafia',
    Citizen = 'Citizen',
    Ghost = 'Ghost',
}

export enum PhaseEnum {
    Night = 'Night',
    Day = 'Day',
}

export enum RoleEnum {
    Mafioso = 'Mafioso',
    Ghost = 'Ghost',
    Citizen = 'Citizen',
}

export enum TokenType {
    AccessToken,
    RefreshToken,
}

export interface GameRoomProjection {
    id: string;
    name: string;
    hasGameStarted: boolean;
    maxPlayers: number;
    currentPlayersCount: number;
}

export interface UserProjection {
    id: string;
    name: string;
    roomId: string;
}

export interface NewUserTokenResponse {
    token: string;
    refreshToken: string;
    expiresOn: string;
}

export interface TokenResponse {
    token: string;
    expiresOn: string;
}

export interface CreateUserDTO {
    userName: string;
}

export interface GameOptions {
    maxPlayers: number;
    phaseDuration: string;
    mafiosoCount: number;
    isPublic: boolean;
    areVotesVisible: boolean;
}

export interface GameState {
    id: string;
    userStates: UserState[];
    phase: PhaseEnum;
    voteState: VoteState[];
    votingStart: string;
    votingEnd: string;
}

export interface Message {
    id: string;
    userId: string;
    sentAt: string;
    content: string;
    roomId: string;
    chatType: ChatTypeEnum;
}

export interface User {
    id: string;
    name: string;
    roomId?: string;
}

export interface UserState {
    userId: string;
    role: string;
}

export interface VoteState {
    userId: string;
    votedUserId: string;
}

// FIXME: Remove this file from repo when interface generation is fixed
