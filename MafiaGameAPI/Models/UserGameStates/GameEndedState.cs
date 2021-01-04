using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MafiaGameAPI.Enums;

namespace MafiaGameAPI.Models.UserGameStates
{
    public class GameEndedState : GameState
    {
        public GameEndedState(GameRoom room)
        {
            _context = room;
        }

        //Dodałem taki konstruktor, żeby mogo nie mia problemu z tworzeniem instancji
        public GameEndedState()
        {
        }

        public override Task<bool> CanSendMessage(string userId, ChatTypeEnum chatType)
        {
            throw new NotImplementedException();
        }

        public override Task ChangePhase()
        {
            throw new NotImplementedException();
        }

        public override Task<IList<ChatTypeEnum>> GetUserChatGroups(string userId)
        {
            throw new NotImplementedException();
        }

        public override Task<bool> IsVoteValid(string votingUserId, string votedUserId)
        {
            throw new NotImplementedException();
        }

        public override bool HasVotingFinished()
        {
            throw new NotImplementedException();
        }
    }
}
