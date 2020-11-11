using System;

namespace MafiaGameAPI.Models {
	public class GameRoom {
		public List<GameState> GameHistory;
		public String Name;
		public PasswordHash? Password;
		public String Id;
		public GameOptions GameOptions;
		public User Owner;
		public string GroupName;
		public List<User> Participants;

	}

}
