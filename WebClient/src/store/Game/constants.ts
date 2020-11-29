import { GameState, User, VoteState } from 'api';
import { InvokeAction } from 'store/utils';

export enum GameActionType {
    connectToGame = 'game/CONNECT',
    connectToGameSuccess = 'game/CONNECT_SUCCESS',

    // invoke actions
    vote = 'game/VOTE',
    startGame = 'game/START',

    // server actions
    gameMemberConnected = 'game/MEMBER_CONNECTED',
    gameMemberDisconnected = 'game/MEMBER_DISCONNECTED',
    newVote = 'game/NEW_VOTE',
    gameEnded = 'game/ENDED',
    votingResult = 'game/VOTING_RESULT',
    stateUpdate = 'game/GAME_STATE_UPDATE',
}

export const gameHubClientName = 'gameHubClient';

export type GameAction = {
    type: GameActionType.connectToGame;
} | {
    type: GameActionType.connectToGameSuccess;
} | InvokeAction<
    GameActionType.vote,
    {
        votedUserId: string;
    }
> | (
    InvokeAction<GameActionType.startGame>
)| {
    type: GameActionType.newVote;
    vote: VoteState;
} | {
    type: GameActionType.stateUpdate;
    state: GameState;
} | {
    type: GameActionType.gameMemberConnected;
    user: User;
} | {
    type: GameActionType.gameMemberDisconnected;
    user: User;
} | {
    type: GameActionType.gameEnded;
    winnerRoleName: string;
} | {
    type: GameActionType.votingResult;
    votedUserId: string;
}
