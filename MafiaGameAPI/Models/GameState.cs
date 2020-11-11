using System;
using System.Collections.Generic;
using MafiaGameAPI.Enums;

namespace MafiaGameAPI.Models {
	public class GameState {
		public List<UserState> UserStates;
		public PhaseEnum Phase;
		public List<VoteState> VoteState;
		public String VotingStart;
		public string Id;

	}

}
