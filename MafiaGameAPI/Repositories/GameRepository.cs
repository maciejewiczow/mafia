using System;
using System.Threading.Tasks;
using MafiaGameAPI.Models;
using MongoDB.Driver;

namespace MafiaGameAPI.Repositories 
{
	public class GameRepository : IGameRepository 
	{
		public GameRepository(IMongoClient mongoClient)
		{

		}
		public async Task<GameState> StartGame(String roomId) 
		{
			throw new System.NotImplementedException("Not implemented");
		}
		public async Task ChangePhase(String roomId) 
		{
			throw new System.NotImplementedException("Not implemented");
		}
		public async Task<VoteState> Vote(String roomId, String userId, String votedUserId) 
		{
			throw new System.NotImplementedException("Not implemented");
		}
		public async Task<GameState> VotingAction() 
		{
			throw new System.NotImplementedException("Not implemented");
		}
		public async Task<GameState> GetCurrentState() 
		{
			throw new System.NotImplementedException("Not implemented");
		}
		public async Task<String> CheckCurrentGameState() 
		{
			throw new System.NotImplementedException("Not implemented");
		}

	}

}
