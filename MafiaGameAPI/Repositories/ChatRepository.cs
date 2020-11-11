using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MafiaGameAPI.Models;
using MongoDB.Driver;

namespace MafiaGameAPI.Repositories 
{
	public class ChatRepository : IChatRepository  
	{
		private readonly IMongoCollection<Message> _messagesCollection;
		public ChatRepository(IMongoClient mongoClient)
		{
			_messagesCollection = mongoClient.GetDatabase("mafia").GetCollection<Message>("messages");
		}
		public async Task<List<Message>> GetMessages(String groupName) 
		{
			throw new System.NotImplementedException("Not implemented");
		}
		public async Task SendMessage(Message message) 
		{
			throw new System.NotImplementedException("Not implemented");
		}

	}

}
