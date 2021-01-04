using System;
using System.Threading.Tasks;
using MafiaGameAPI.Models;

namespace MafiaGameAPI.Services
{
    public interface IGameService
    {
        Task<GameState> StartGame(String roomId, String userId);
        Task ChangePhase(String roomId, GameState newState);
        Task<VoteState> Vote(String roomId, String userId, String votedUserId);
        Task<GameState> VotingAction(String roomId);
        Task<GameState> GetCurrentState(String roomId);
    }
}
