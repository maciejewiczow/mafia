using System;

namespace MafiaGameAPI.Repositories {
	public interface IGameRepository {
		MafiaGameAPI.Models.GameState StartGame(ref String roomId);
		void ChangePhase(ref String roomId);
		MafiaGameAPI.Models.VoteState Vote(ref String roomId, ref String userId, ref String votedUserId);
		MafiaGameAPI.Models.GameState VotingAction();
		MafiaGameAPI.Models.GameState GetCurrentState();
		String CheckCurrentGameState();

	}

}
