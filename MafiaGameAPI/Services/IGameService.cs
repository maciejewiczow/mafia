using System;
using System.Threading.Tasks;
using MafiaGameAPI.Models;

namespace MafiaGameAPI.Services
{
    public interface IGameService
    {
        Task<GameState> StartGame(String roomId, String userId);
        Task<VoteState> Vote(String roomId, String userId, String votedUserId);
        Task ChangeTurn(String roomId, String stateId);
    }
}
