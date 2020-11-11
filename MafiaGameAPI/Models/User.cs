using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MafiaGameAPI.Models 
{
	public class User 
	{
		public string Id { get; set; }
		public string Name { get; set; }

	}

}
