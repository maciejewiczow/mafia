using System;
using System.Collections.Generic;
using MafiaGameAPI.Models;

namespace MafiaGameAPI.Repositories {
	public interface IChatRepository {
		List<Message> GetMessages(String groupName);
		void SendMessage(Message message);

	}

}
