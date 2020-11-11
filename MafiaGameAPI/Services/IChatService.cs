using System;
using System.Collections.Generic;
using MafiaGameAPI.Enums;
using MafiaGameAPI.Models;

namespace MafiaGameAPI.Services {
	public interface IChatService {
		List<Message> GetMessages(String groupName);
		void SendMessage(String userId, ChatType type, String content);
	}
}
