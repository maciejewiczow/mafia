using System.Threading.Tasks;
using MafiaGameAPI.Enums;

namespace MafiaGameAPI.Helpers
{
    public interface IValidationHelper
    {
        Task<bool> IsUserAutorizedToStartGame(string roomId, string userId);
        Task<bool> IsMessageValid(string userId, string roomId, ChatTypeEnum chatType, string content);
        Task<bool> IsVoteValid(string roomId, string userId, string votedUserId);
    }
}
