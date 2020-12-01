using System;
using System.Threading.Tasks;
using MafiaGameAPI.Models;
using MafiaGameAPI.Enums;

namespace MafiaGameAPI.Repositories
{
    public interface IGameRepository
    {
        Task<GameState> StartGame(String roomId, GameState state);
        Task SetGameEnded(String roomId, RoleEnum winnerRole);
        Task ChangePhase(String roomId, GameState state);
        Task<VoteState> Vote(String roomId, VoteState vote);
        Task<GameState> GetCurrentState(String roomId);
        Task<String> GetCurrentGameStateId(String roomId);
    }
}
