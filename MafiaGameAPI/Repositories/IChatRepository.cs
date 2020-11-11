using System;

namespace MafiaGameAPI.Repositories {
	public interface IChatRepository {
		List<Message> GetMessages(ref String groupName);
		void SendMessage(ref Message message);

	}

}
