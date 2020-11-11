using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MafiaGameAPI.Models.Projections 
{
	public class GameRoomProjection 
	{
		[BsonId]
		public string Id { get; set; }
		public String Name { get; set; }
		public bool IsGameStarted { get; set; }
		public int MaxPlayers { get; set; }
		public int CurrentPlayersCount { get; set; }

	}

}
