using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MafiaGameAPI.Enums;

namespace MafiaGameAPI.Models.UserGameStates
{
    public class GameEndedState : GameState
    {
        public GameEndedState(GameRoom room): base()
        {
            Context = room;
        }

        //Dodałem taki konstruktor, żeby mogo nie mia problemu z tworzeniem instancji
        public GameEndedState(): base()
        { }

        public override bool CanSendMessage(string userId, ChatTypeEnum chatType) => false;

        public override void ChangePhase()
        { }

        public override IList<ChatTypeEnum> GetUserChatGroups(string userId) => new List<ChatTypeEnum>();

        public override bool IsVoteValid(string votingUserId, string votedUserId) => false;

        public override bool HasVotingFinished() => false;
    }
}
