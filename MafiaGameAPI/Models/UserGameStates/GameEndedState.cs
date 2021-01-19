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
            Context = room;
        }

        //Dodałem taki konstruktor, żeby mogo nie mia problemu z tworzeniem instancji
        public GameEndedState()
        {
        }

        public override bool CanSendMessage(string userId, ChatTypeEnum chatType)
        {
            return false;
        }

        public override void ChangePhase()
        { }

        public override IList<ChatTypeEnum> GetUserChatGroups(string userId)
        {
            return new List<ChatTypeEnum>();
        }

        public override bool IsVoteValid(string votingUserId, string votedUserId)
        {
            return false;
        }

        public override bool HasVotingFinished()
        {
            return false;
        }
    }
}
