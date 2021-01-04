using System.Threading.Tasks;
using MafiaGameAPI.Enums;
using MafiaGameAPI.Models;

namespace MafiaGameAPI.Helpers
{
    public interface IValidationHelper
    {
        Task<bool> IsUserAutorizedToStartGame(string roomId, string userId);
        Task<bool> IsMessageValid(string userId, GameRoom room, ChatTypeEnum chatType, string content);
        Task<bool> IsVoteValid(string userId, GameRoom room, string votedUserId);
    }
}
