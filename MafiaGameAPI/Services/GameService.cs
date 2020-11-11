using System;
using MafiaGameAPI.Models;
using MafiaGameAPI.Repositories;

namespace MafiaGameAPI.Services {
	public class GameService : IGameService {
		private IGameRepository _gameRepository;
		public GameService(IGameRepository gameRepository)
		{
			_gameRepository = gameRepository;
		}
		public GameState StartGame() {
			throw new NotImplementedException("Not implemented");
		}
		public void ChangePhase(String roomId) {
			throw new NotImplementedException("Not implemented");
		}
		public VoteState Vote(String votedUserId) {
			throw new NotImplementedException("Not implemented");
		}
		public GameState VotingAction() {
			throw new NotImplementedException("Not implemented");
		}
		public GameState GetCurrentState() {
			throw new NotImplementedException("Not implemented");
		}
		public void RunPhase() {
			throw new NotImplementedException("Not implemented");
		}
		public GameState StartGame(String roomId) {
			throw new NotImplementedException("Not implemented");
		}
    }

}
