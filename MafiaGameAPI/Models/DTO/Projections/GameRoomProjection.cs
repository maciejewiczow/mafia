using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MafiaGameAPI.Models.DTO.Projections
{
	public class GameRoomProjection
	{
		[BsonId]
		public ObjectId Id { get; set; }
		public String Name { get; set; }
		public bool IsGameStarted { get; set; }
		public int MaxPlayers { get; set; }
		public int CurrentPlayersCount { get; set; }
	}
}
