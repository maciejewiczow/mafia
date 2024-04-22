import { GameState, VoteState } from 'api';
import { InvokeAction, InvokeActionBundle } from 'store/utils';

export enum GameActionType {
    // invoke actions
    vote = 'game/VOTE',
    startGame = 'game/START',
    invokeVote = 'game/INVOKE_VOTE',
    invokeStartGame = 'game/INVOKE_START',
    invokeStartGameSuccess = `game/INVOKE_START_SUCCESS`,
    invokeStartGameFail = 'game/INVOKE_START_FAIL',

    // server actions
    newVote = 'game/NEW_VOTE',
    gameEnded = 'game/ENDED',
    votingResult = 'game/VOTING_RESULT',
    stateUpdate = 'game/GAME_STATE_UPDATE',
    gameStarted = 'game/GAME_STARTED',
}

export type GameAction = {
    type: GameActionType.startGame;
} | (
        InvokeAction<
            GameActionType.invokeVote,
            [string /* votedUserId */]
        >
    ) | (
        InvokeActionBundle<
            GameActionType.invokeStartGame,
            GameActionType.invokeStartGameSuccess,
            GameActionType.invokeStartGameFail,
            undefined,
            GameState
        >
    ) | {
        type: GameActionType.newVote;
        vote: VoteState;
    } | {
        type: GameActionType.stateUpdate;
        state: GameState;
    } | {
        type: GameActionType.gameEnded;
        winnerRoleName: string;
    } | {
        type: GameActionType.votingResult;
        votedUserId: string;
    } | {
        type: GameActionType.gameStarted;
    };
