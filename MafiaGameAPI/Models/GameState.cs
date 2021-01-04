using System;
using System.Collections.Generic;
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
        public List<UserState> UserStates { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public List<VoteState> VoteState { get; set; }
        public DateTime VotingStart { get; set; }
        public DateTime VotingEnd { get; set; }
    }
}
