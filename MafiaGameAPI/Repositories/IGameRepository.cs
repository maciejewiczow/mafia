using System;
using System.Threading.Tasks;
using MafiaGameAPI.Models;

namespace MafiaGameAPI.Repositories 
{
	public interface IGameRepository 
	{
		Task<GameState> StartGame(String roomId, GameState state);
		Task ChangePhase(String roomId, GameState state);
		Task<VoteState> Vote(String roomId, String userId, String votedUserId);
		Task<GameState> VotingAction();
		Task<GameState> GetCurrentState(String roomId);
		Task<String> GetCurrentGameStateId(String roomId);

	}

}
