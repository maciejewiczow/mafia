using System;
using System.Threading.Tasks;
using MafiaGameAPI.Models;

namespace MafiaGameAPI.Hubs
{
    public interface IGameClient
    {
        Task UpdateGameStateAsync(GameState state);
        Task GameStartedAsync();
        Task GameMemberConnectedAsync(User newMember);
        Task GameMemberDisconnectedAsync(User user);
        Task NewVoteAsync(VoteState vote);
        Task GameEndedAsync(String winnerRoleName);
        Task UpdateVotingResultAsync(String votedUserId);
    }
}
