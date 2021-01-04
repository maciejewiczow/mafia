using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MafiaGameAPI.Enums;

namespace MafiaGameAPI.Models.UserGameStates
{
    public interface IUserGameState
    {
        Task<bool> IsVoteValid(string votingUserId, string votedUserId);
        Task<IList<string>> GetUserChatGroups();
        Task<bool> CanSendMessage(ChatTypeEnum chatType);
        Task ChangePhase();
    }
}
