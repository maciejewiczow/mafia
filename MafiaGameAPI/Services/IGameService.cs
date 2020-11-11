using System;

namespace MafiaGameAPI.Services {
	public interface IGameService {
		MafiaGameAPI.Models.GameState StartGame(ref String roomId);
		void ChangePhase(ref String roomId);
		MafiaGameAPI.Models.VoteState Vote(ref String votedUserId);
		MafiaGameAPI.Models.GameState VotingAction();
		MafiaGameAPI.Models.GameState GetCurrentState();

	}

}
