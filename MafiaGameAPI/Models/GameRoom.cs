using System;
using System.Collections.Generic;

namespace MafiaGameAPI.Models {
	public class GameRoom {
		public List<GameState> GameHistory;
		public String Name;
		public String Password;
		public String Id;
		public GameOptions GameOptions;
		public User Owner;
		public String GroupName;
		public List<User> Participants;

	}

}
