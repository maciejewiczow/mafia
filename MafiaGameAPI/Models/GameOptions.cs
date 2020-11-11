using System;

namespace MafiaGameAPI.Models 
{
	public class GameOptions 
	{
		public int MaxPlayers { get; set; }
		public TimeSpan PhaseTime { get; set; }
		public int MafiosoCount { get; set; }
		public bool IsPublic { get; set; }
		public bool VisibleVotes { get; set; }

	}

}
