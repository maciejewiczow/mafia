using System;
using MafiaGameAPI.Enums;
using MafiaGameAPI.Services;

namespace MafiaGameAPI.Hubs {
	public class ChatHub {
		private IChatService _chatService;

		public void SendMessage(ChatType chatType, String content) {
			throw new NotImplementedException("Not implemented");
		}
		public void OnConnect() {
			throw new NotImplementedException("Not implemented");
		}

	}

}
