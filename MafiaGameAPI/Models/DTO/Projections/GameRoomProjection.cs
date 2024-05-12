using System;
using MongoDB.Bson.Serialization.Attributes;

namespace MafiaGameAPI.Models.DTO.Projections
{
    public class GameRoomProjection
    {
        [BsonId]
        public string Id { get; set; }
        public String Name { get; set; }
        public bool HasGameStarted { get; set; }
        public int MaxPlayers { get; set; }
        public int CurrentPlayersCount { get; set; }
    }
}
