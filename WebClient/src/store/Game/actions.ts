import { GameState, User, VoteState } from 'api';
import { PickAction } from 'store/utils';
import { GameAction, GameActionType, gameHubClientName } from './constants';

export const connectToGame = (): PickAction<GameAction, GameActionType.connectToGame> => ({
    type: GameActionType.connectToGame,
});

export const connectToGameSuccess = (): PickAction<GameAction, GameActionType.connectToGameSuccess> => ({
    type: GameActionType.connectToGameSuccess,
});

export const vote = (votedUserId: string): PickAction<GameAction, GameActionType.vote> => ({
    type: GameActionType.vote,
    isInvokeAction: true,
    hubClientName: gameHubClientName,
    methodName: 'Vote',
    args: {
        votedUserId,
    },
});

export const startGame = (): PickAction<GameAction, GameActionType.startGame> => ({
    type: GameActionType.startGame,
    isInvokeAction: true,
    hubClientName: gameHubClientName,
    methodName: 'StartGame',
    args: undefined,
});

export const gameMemberConnected = (user: User): PickAction<GameAction, GameActionType.gameMemberConnected> => ({
    type: GameActionType.gameMemberConnected,
    user,
});

export const gameMemberDisconnected = (user: User): PickAction<GameAction, GameActionType.gameMemberDisconnected> => ({
    type: GameActionType.gameMemberDisconnected,
    user,
});

export const newVote = (incomingVote: VoteState): PickAction<GameAction, GameActionType.newVote> => ({
    type: GameActionType.newVote,
    vote: incomingVote,
});

export const gameEnded = (winnerRoleName: string): PickAction<GameAction, GameActionType.gameEnded> => ({
    type: GameActionType.gameEnded,
    winnerRoleName,
});

export const votingResult = (votedUserId: string): PickAction<GameAction, GameActionType.votingResult> => ({
    type: GameActionType.votingResult,
    votedUserId,
});

export const stateUpdate = (state: GameState) :PickAction<GameAction, GameActionType.stateUpdate> => ({
    type: GameActionType.stateUpdate,
    state,
});
