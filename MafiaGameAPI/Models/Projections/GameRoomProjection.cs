using System;

namespace MafiaGameAPI.Models.Projections 
{
	public class GameRoomProjection 
	{
		private String Name { get; set; }
		private bool IsGameStarted { get; set; }
		private int MaxPlayers { get; set; }
		private int CurrentPlayersCount { get; set; }

	}

}
