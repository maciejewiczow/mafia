using System;
using System.Collections.Generic;
using MafiaGameAPI.Enums;

namespace MafiaGameAPI.Models
{
    public class GameState
    {
        public string Id { get; set; }
        public List<UserState> UserStates { get; set; }
        public PhaseEnum Phase { get; set; }
        public List<VoteState> VoteState { get; set; }
        public DateTime VotingStart { get; set; }
    }

}
