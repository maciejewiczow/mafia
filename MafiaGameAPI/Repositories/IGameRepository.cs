using System;
using System.Threading.Tasks;
using MafiaGameAPI.Models;

namespace MafiaGameAPI.Repositories
{
    public interface IGameRepository
    {
        Task<GameState> StartGame(String roomId);
        Task ChangePhase(String roomId);
        Task<VoteState> Vote(String roomId, String userId, String votedUserId);
        Task<GameState> VotingAction();
        Task<GameState> GetCurrentState();
        Task<String> CheckCurrentGameState();
    }
}
