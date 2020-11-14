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
			var filter = Builders<Message>.Filter.Eq(m => m.GroupName, groupName);
			List<Message> messages;

			try
			{
				messages = await _messagesCollection.Find(filter).ToListAsync();
			}
			catch(Exception)
			{
				throw;
			}

			return messages;
		}
		public async Task SendMessage(Message message) 
		{
			try
			{
				await _messagesCollection.InsertOneAsync(message);
			}
			catch(Exception)
			{
				throw;
			}
		}

	}

}
