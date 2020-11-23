export enum chatTypeEnum {
    General,
    Mafia,
    Citizen,
    Ghost
}

export enum phaseEnum {
    Night,
    Day
}

export enum roleEnum {
    Mafioso,
    Ghost,
    Citizen
}

export enum tokenType {
    AccessToken,
    RefreshToken
}

export interface gameRoomProjection {
    id: string;
    name: string;
    isGameStarted: boolean;
    maxPlayers: number;
    currentPlayersCount: number;
}

export interface userProjection {
    id: string;
    name: string;
    roomId: string;
}

export interface newUserTokenResponse {
    token: string;
    refreshToken: string;
    expiresOn: string;
}

export interface tokenResponse {
    token: string;
    expiresOn: string;
}

export interface createUserDTO {
    userName: string;
}

export interface gameOptions {
    maxPlayers: number;
    phaseTime: string;
    mafiosoCount: number;
    isPublic: boolean;
    visibleVotes: boolean;
}

export interface gameRoom {
    gameHistory: gameState[];
    currentGameStateId: string;
    name: string;
    password: string;
    gameOptions: gameOptions;
    owner: string;
    groupName: string;
    participants: string[];
    isGameStarted: boolean;
    isGameEnded: boolean;
}

export interface gameState {
    id: string;
    userStates: userState[];
    phase: phaseEnum;
    voteState: voteState[];
    votingStart: string;
}

export interface message {
    id: string;
    userId: string;
    sentAt: string;
    content: string;
    groupName: string;
}

export interface user {
    id: string;
    name: string;
    roomId: string;
}

export interface userState {
    userId: string;
    role: roleEnum;
}

export interface voteState {
    userId: string;
    votedUserId: string;
}