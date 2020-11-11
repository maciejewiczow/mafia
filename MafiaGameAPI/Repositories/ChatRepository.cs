using System;
using System.Collections.Generic;
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
		public List<Message> GetMessages(String groupName) 
		{
			throw new System.NotImplementedException("Not implemented");
		}
		public void SendMessage(Message message) 
		{
			throw new System.NotImplementedException("Not implemented");
		}

	}

}
