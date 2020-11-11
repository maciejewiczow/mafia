using System;

namespace MafiaGameAPI.Services {
	public class GameService : IGameService<MafiaGameAPI.Models.Projections.GameRoomProjection>  {
		private MafiaGameAPI.Repositories.IGameRepository _gameRepository;

		public MafiaGameAPI.Models.GameState StartGame() {
			throw new System.NotImplementedException("Not implemented");
		}
		private void ChangePhase(ref String roomId) {
			throw new System.NotImplementedException("Not implemented");
		}
		public MafiaGameAPI.Models.VoteState Vote(ref String votedUserId) {
			throw new System.NotImplementedException("Not implemented");
		}
		public MafiaGameAPI.Models.GameState VotingAction() {
			throw new System.NotImplementedException("Not implemented");
		}
		public MafiaGameAPI.Models.GameState GetCurrentState() {
			throw new System.NotImplementedException("Not implemented");
		}
		public void RunPhase() {
			throw new System.NotImplementedException("Not implemented");
		}
		public MafiaGameAPI.Models.GameState StartGame(ref String roomId) {
			throw new System.NotImplementedException("Not implemented");
		}

	}

}
