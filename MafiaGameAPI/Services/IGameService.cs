using System;
using MafiaGameAPI.Models;

namespace MafiaGameAPI.Services 
{
	public interface IGameService 
	{
		GameState StartGame(String roomId);
		void ChangePhase(String roomId);
		VoteState Vote(String votedUserId);
		GameState VotingAction();
		GameState GetCurrentState();
	}
}
