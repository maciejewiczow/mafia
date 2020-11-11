using System;
using System.Threading.Tasks;
using MafiaGameAPI.Models;

namespace MafiaGameAPI.Services 
{
	public interface IGameService 
	{
		Task<GameState> StartGame(String roomId);
		Task ChangePhase(String roomId);
		Task<VoteState> Vote(String votedUserId);
		Task<GameState> VotingAction();
		Task<GameState> GetCurrentState();
	}
}
