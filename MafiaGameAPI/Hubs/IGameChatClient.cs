using System.Threading.Tasks;
using System.Collections.Generic;
using MafiaGameAPI.Models;

namespace MafiaGameAPI.Hubs
{
    public interface IGameChatClient
    {
        Task MessageAsync(Message m);
        Task MessagesOnConnectedAsync(List<Message> m);
        Task UserConnectedAsync(User u);
        Task UserDisconnectedAsync(User u);
        Task UpdateGameStateAsync(GameState state);
        Task GameStartedAsync();
        Task NewVoteAsync(VoteState vote);
        Task GameEndedAsync(string winnerRoleName);
        Task UpdateVotingResultAsync(string votedUserId);
        Task CallAddToGhostGroup();
    }
}
