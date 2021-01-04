using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MafiaGameAPI.Enums;
using MongoDB.Bson.Serialization.Attributes;

namespace MafiaGameAPI.Models.UserGameStates
{
    public class GameDayState : GameState, IUserGameState
    {
        [BsonIgnore]
        private readonly GameRoom _context;

        public GameDayState(GameRoom room)
        {
            _context = room;
        }

        public Task<bool> CanSendMessage(ChatTypeEnum chatType)
        {
            throw new NotImplementedException();
        }

        public Task ChangePhase()
        {
            throw new NotImplementedException();
        }

        public Task<IList<string>> GetUserChatGroups()
        {
            throw new NotImplementedException();
        }

        public Task<bool> IsVoteValid(string votingUserId, string votedUserId)
        {
            throw new NotImplementedException();
        }
    }
}
