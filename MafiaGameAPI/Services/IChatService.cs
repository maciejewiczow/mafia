using System;

namespace MafiaGameAPI.Services {
	public interface IChatService {
		List<Message> GetMessages(ref String groupName);
		void SendMessage(ref String userId, ref MafiaGameAPI.Enums.ChatType t, ref String content);

	}

}
