using System;
using System.Collections.Generic;
using MafiaGameAPI.Enums;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace MafiaGameAPI.Models
{
    public class GameState
    {
        public string Id { get; set; }
        public List<UserState> UserStates { get; set; }
        [JsonConverter(typeof(StringEnumConverter))]
        public PhaseEnum Phase { get; set; }
        public List<VoteState> VoteState { get; set; }
        public DateTime VotingStart { get; set; }
    }
}
