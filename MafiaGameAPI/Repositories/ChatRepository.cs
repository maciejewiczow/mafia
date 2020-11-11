using System;

namespace MafiaGameAPI.Repositories {
	public class ChatRepository : IChatRepository<MafiaGameAPI.Models.VoteState>  {
		public List<Message> GetMessages(ref String groupName) {
			throw new System.NotImplementedException("Not implemented");
		}
		public void SendMessage(ref Message message) {
			throw new System.NotImplementedException("Not implemented");
		}

	}

}
