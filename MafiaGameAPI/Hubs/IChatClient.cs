using System.Threading.Tasks;
using System.Collections.Generic;
using MafiaGameAPI.Models;

namespace MafiaGameAPI.Hubs
{
    public interface IChatClient
    {
        Task MessageAsync(Message m);
        Task MessagesOnConnectedAsync(List<Message> m);
        Task UserConnectedAsync(User u);
        Task UserDisconnectedAsync(string userId);
    }
}
