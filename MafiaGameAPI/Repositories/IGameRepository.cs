using System;
using System.Threading.Tasks;
using MafiaGameAPI.Models;

namespace MafiaGameAPI.Repositories
{
    public interface IGameRepository
    {
        Task SaveGameState(String roomId, GameState state);
        Task<VoteState> Vote(String roomId, VoteState vote);
        Task<GameState> GetCurrentState(String roomId);
    }
}
