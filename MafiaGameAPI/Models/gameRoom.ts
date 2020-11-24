export interface GameRoom {
    id: ObjectId;
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