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
        public List<VoteState> VoteState { get; set; }
        public DateTime VotingStart { get; set; }
        public DateTime VotingEnd { get; set; }
        public abstract bool IsVoteValid(string votingUserId, string votedUserId);
        public abstract IList<ChatTypeEnum> GetUserChatGroups(string userId);
        public abstract bool CanSendMessage(string userId, ChatTypeEnum chatType);
        public abstract void ChangePhase();
        public abstract bool HasVotingFinished();

        [BsonIgnore]
        [JsonIgnore]
        public GameRoom Context { get; set; }

        [BsonIgnore]
        public PhaseEnum? Phase => this switch 
        {
            GameDayState _ => PhaseEnum.Day,
            GameNightState _ => PhaseEnum.Night,
            _ => null
        };
    }
}
