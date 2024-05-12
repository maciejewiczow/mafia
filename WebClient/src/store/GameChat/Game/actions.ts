import { GameState, VoteState } from 'api';
import { PickAction } from 'store/utils';
import { GameAction, GameActionType } from './constants';

export const invokeVote = (
    votedUserId: string,
): PickAction<GameAction, GameActionType.invokeVote> => ({
    type: GameActionType.invokeVote,
    successActionType: undefined,
    errorActionType: undefined,
    isInvokeAction: true,
    methodName: 'Vote',
    args: [votedUserId],
});

export const invokeStartGame = (): PickAction<
    GameAction,
    GameActionType.invokeStartGame
> => ({
    type: GameActionType.invokeStartGame,
    successActionType: GameActionType.invokeStartGameSuccess,
    errorActionType: GameActionType.invokeStartGameFail,
    isInvokeAction: true,
    methodName: 'StartGame',
    args: undefined,
});

export const gameStarted = (): PickAction<
    GameAction,
    GameActionType.gameStarted
> => ({
    type: GameActionType.gameStarted,
});

export const startGame = (): PickAction<
    GameAction,
    GameActionType.startGame
> => ({
    type: GameActionType.startGame,
});

export const newVote = (
    incomingVote: VoteState,
): PickAction<GameAction, GameActionType.newVote> => ({
    type: GameActionType.newVote,
    vote: incomingVote,
});

export const gameEnded = (
    winnerRoleName: string,
): PickAction<GameAction, GameActionType.gameEnded> => ({
    type: GameActionType.gameEnded,
    winnerRoleName,
});

export const votingResult = (
    votedUserId: string,
): PickAction<GameAction, GameActionType.votingResult> => ({
    type: GameActionType.votingResult,
    votedUserId,
});

export const stateUpdate = (
    state: GameState,
): PickAction<GameAction, GameActionType.stateUpdate> => ({
    type: GameActionType.stateUpdate,
    state,
});
