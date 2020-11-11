using System;

namespace MafiaGameAPI.Models {
	public class GameState {
		public List<UserState> UserStates;
		public PhaseEnum Phase;
		public List<VoteState> VoteState;
		public TimeStamp VotingStart;
		public string Id;

	}

}
