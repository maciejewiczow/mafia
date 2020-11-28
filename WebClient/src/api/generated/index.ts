export enum ChatTypeEnum {
    General = 'General',
    Mafia = 'Mafia',
    Citizen = 'Citizen',
    Ghost = 'Ghost'
}

export enum PhaseEnum {
    Night,
    Day
}

export enum RoleEnum {
    Mafioso,
    Ghost,
    Citizen
}

export enum TokenType {
    AccessToken,
    RefreshToken
}

export interface GameRoomProjection {
    id: string;
    name: string;
    isGameStarted: boolean;
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
    phaseTime: string;
    mafiosoCount: number;
    isPublic: boolean;
    visibleVotes: boolean;
}

export interface GameState {
    id: string;
    userStates: UserState[];
    phase: PhaseEnum;
    voteState: VoteState[];
    votingStart: string;
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
    roomId: string;
}

export interface UserState {
    userId: string;
    role: RoleEnum;
}

export interface VoteState {
    userId: string;
    votedUserId: string;
}

// FIXME: Remove this file from repo when interface generation is fixed
