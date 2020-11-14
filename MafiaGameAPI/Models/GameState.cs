using System;
using System.Collections.Generic;
using MafiaGameAPI.Enums;

namespace MafiaGameAPI.Models 
{
	public class GameState 
	{
		public List<UserState> UserStates { get; set; }
		public PhaseEnum Phase { get; set; }
		public List<VoteState> VoteState { get; set; }
		public DateTime VotingStart { get; set; }
		public string Id { get; set; }
		
	}

}
