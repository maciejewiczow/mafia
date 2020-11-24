using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;


namespace MafiaGameAPI.Models
{
    public class GameRoom
    {
        [BsonId]
        public ObjectId Id { get; set; }
        public List<GameState> GameHistory { get; set; }
        public String CurrentGameStateId { get; set; }
        public String Name { get; set; }
        public String Password { get; set; }
        public GameOptions GameOptions { get; set; }
        public string Owner { get; set; }
        public String GroupName { get; set; }
        public List<string> Participants { get; set; }
        public List<User> ParticipantsWithNames { get; set; }
        public bool IsGameStarted { get; set; }
        public bool IsGameEnded { get; set; }

        public GameRoom(string name, string ownerId)
        {
            Name = name;
            Owner = ownerId;
            GameOptions = new GameOptions();
            GameHistory = new List<GameState>();
            Participants = new List<string>();
            Participants.Add(ownerId);
            IsGameStarted = false;
            IsGameEnded = false;
        }
    }

}
