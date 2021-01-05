using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MafiaGameAPI.Enums;
using MafiaGameAPI.Models.UserGameStates;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace MafiaGameAPI.Models
{
    [BsonDiscriminator(RootClass = true)]
    [BsonKnownTypes(
        typeof(GameDayState),
        typeof(GameNightState),
        typeof(GameNotStartedState),
        typeof(GameEndedState)
    )]
    public abstract class GameState
    {
        public string Id { get; set; }
        public List<UserState> UserStates { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public List<VoteState> VoteState { get; set; }
        public DateTime VotingStart { get; set; }
        public DateTime VotingEnd { get; set; }
        public abstract bool IsVoteValid(string votingUserId, string votedUserId);
        public abstract IList<ChatTypeEnum> GetUserChatGroups(string userId);
        public abstract bool CanSendMessage(string userId, ChatTypeEnum chatType);
        public abstract void ChangePhase();
        public abstract bool HasVotingFinished();
        [BsonIgnore]
        protected private GameRoom _context { get; set; }

        public void SetContext(GameRoom room)
        {
            _context = room;
        }
    }
}
