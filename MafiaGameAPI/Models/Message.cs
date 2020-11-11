using System;

namespace MafiaGameAPI.Models 
{
	public class Message 
	{
		public User Author { get; set; }
		public DateTime SentAt { get; set; }
		public String Content { get; set; }
		public String GroupName { get; set; }

	}

}
