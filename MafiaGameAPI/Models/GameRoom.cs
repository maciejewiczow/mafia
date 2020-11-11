using System;
using System.Collections.Generic;

namespace MafiaGameAPI.Models 
{
	public class GameRoom 
	{
		public List<GameState> GameHistory { get; set; }
		public String Name { get; set; }
		public String Password { get; set; }
		public String Id { get; set; }
		public GameOptions GameOptions { get; set; }
		public User Owner { get; set; }
		public String GroupName { get; set; }
		public List<User> Participants { get; set; }

	}

}
