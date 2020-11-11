using System;
using System.Threading.Tasks;
using MafiaGameAPI.Models;
using MafiaGameAPI.Repositories;

namespace MafiaGameAPI.Services {
	public class GameService : IGameService {
		private IGameRepository _gameRepository;
		public GameService(IGameRepository gameRepository)
		{
			_gameRepository = gameRepository;
		}
		public async Task<GameState> StartGame() {
			throw new NotImplementedException("Not implemented");
		}
		public async Task ChangePhase(String roomId) {
			throw new NotImplementedException("Not implemented");
		}
		public async Task<VoteState> Vote(String votedUserId) {
			throw new NotImplementedException("Not implemented");
		}
		public async Task<GameState> VotingAction() {
			throw new NotImplementedException("Not implemented");
		}
		public async Task<GameState> GetCurrentState() {
			throw new NotImplementedException("Not implemented");
		}
		public async Task RunPhase() {
			throw new NotImplementedException("Not implemented");
		}
		public async Task<GameState> StartGame(String roomId) {
			throw new NotImplementedException("Not implemented");
		}
    }

}
