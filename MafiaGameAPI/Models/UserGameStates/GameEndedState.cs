using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MafiaGameAPI.Enums;
using MongoDB.Bson.Serialization.Attributes;

namespace MafiaGameAPI.Models.UserGameStates
{
    public class GameEndedState : GameState
    {
        [BsonIgnore]
        private readonly GameRoom _context;

        public GameEndedState(GameRoom room)
        {
            _context = room;
        }

        public override Task<bool> CanSendMessage(ChatTypeEnum chatType)
        {
            throw new NotImplementedException();
        }

        public override Task ChangePhase()
        {
            throw new NotImplementedException();
        }

        public override Task<IList<string>> GetUserChatGroups()
        {
            throw new NotImplementedException();
        }

        public override Task<bool> IsVoteValid(string votingUserId, string votedUserId)
        {
            throw new NotImplementedException();
        }
    }
}
