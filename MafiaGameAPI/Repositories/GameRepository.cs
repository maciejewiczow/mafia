using System;
using MafiaGameAPI.Models;
using MongoDB.Driver;

namespace MafiaGameAPI.Repositories 
{
	public class GameRepository : IGameRepository 
	{
		public GameRepository(IMongoClient mongoClient)
		{

		}
		public MafiaGameAPI.Models.GameState StartGame(ref String roomId) 
		{
			throw new System.NotImplementedException("Not implemented");
		}
		public void ChangePhase(ref String roomId) 
		{
			throw new System.NotImplementedException("Not implemented");
		}
		public MafiaGameAPI.Models.VoteState Vote(ref String roomId, ref String userId, ref String votedUserId) 
		{
			throw new System.NotImplementedException("Not implemented");
		}
		public MafiaGameAPI.Models.GameState VotingAction() 
		{
			throw new System.NotImplementedException("Not implemented");
		}
		public MafiaGameAPI.Models.GameState GetCurrentState() 
		{
			throw new System.NotImplementedException("Not implemented");
		}
		public String CheckCurrentGameState() 
		{
			throw new System.NotImplementedException("Not implemented");
		}

	}

}
