using System;

namespace MafiaGameAPI.Services {
	public class ChatService : IChatService<MafiaGameAPI.Models.Projections.GameRoomProjection>  {
		private IChatRepository _chatRepository;

		public List<Message> GetMessages(ref String groupName) {
			throw new System.NotImplementedException("Not implemented");
		}
		public void SendMessage(ref String userId, ref MafiaGameAPI.Enums.ChatType t, ref String content) {
			throw new System.NotImplementedException("Not implemented");
		}

	}

}
