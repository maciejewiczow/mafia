using System.Threading.Tasks;
using MafiaGameAPI.Models;

namespace MafiaGameAPI.Hubs
{
    public interface IChatClient
    {
        Task MessageAsync(Message m);
        Task UserConnectedAsync(User u);
        Task UserDisconnectedAsync(string userId);
    }
}
