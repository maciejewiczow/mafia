import { GameState, User, VoteState } from 'api';
import { PickAction } from 'store/utils';
import { GameAction, GameActionType, gameHubClientName } from './constants';

export const connectToGame = (): PickAction<GameAction, GameActionType.connectToGame> => ({
    type: GameActionType.connectToGame,
});

export const connectToGameSuccess = (): PickAction<GameAction, GameActionType.connectToGameSuccess> => ({
    type: GameActionType.connectToGameSuccess,
});

export const invokeVote = (votedUserId: string): PickAction<GameAction, GameActionType.invokeVote> => ({
    type: GameActionType.invokeVote,
    successActionType: undefined,
    errorActionType: undefined,
    isInvokeAction: true,
    hubClientName: gameHubClientName,
    methodName: 'Vote',
    args: [votedUserId],
});

export const invokeStartGame = (): PickAction<GameAction, GameActionType.invokeStartGame> => ({
    type: GameActionType.invokeStartGame,
    successActionType: GameActionType.invokeStartGameSuccess,
    errorActionType: GameActionType.invokeStartGameFail,
    isInvokeAction: true,
    hubClientName: gameHubClientName,
    methodName: 'StartGame',
    args: undefined,
});

export const startGame = (): PickAction<GameAction, GameActionType.startGame> => ({
    type: GameActionType.startGame,
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
