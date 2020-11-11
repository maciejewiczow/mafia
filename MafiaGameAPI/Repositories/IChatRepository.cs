using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MafiaGameAPI.Models;

namespace MafiaGameAPI.Repositories 
{
	public interface IChatRepository 
	{
		Task<List<Message>> GetMessages(String groupName);
		Task SendMessage(Message message);

	}

}
