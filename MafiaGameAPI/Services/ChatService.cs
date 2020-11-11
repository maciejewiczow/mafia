using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MafiaGameAPI.Enums;
using MafiaGameAPI.Models;
using MafiaGameAPI.Repositories;

namespace MafiaGameAPI.Services 
{
	public class ChatService : IChatService  
	{
		private IChatRepository _chatRepository;
		public ChatService(IChatRepository chatRepository)
		{
			_chatRepository = chatRepository;
		}

		public async Task<List<Message>> GetMessages(String groupName) 
		{
			throw new System.NotImplementedException("Not implemented");
		}
		public async Task SendMessage(String userId, ChatType type, String content) 
		{
			throw new System.NotImplementedException("Not implemented");
		}

	}

}
