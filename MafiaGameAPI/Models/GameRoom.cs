using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MafiaGameAPI.Enums;
using MafiaGameAPI.Models.UserGameStates;

namespace MafiaGameAPI.Models
{
    public class GameRoom
    {
        [BsonId]
        public ObjectId Id { get; set; }
        public GameState CurrentGameState { get; set; }
        public String Name { get; set; }
        public String Password { get; set; }
        public GameOptions GameOptions { get; set; }
        public string Owner { get; set; }
        public List<string> Participants { get; set; }
        public RoleEnum WinnerRole { get; set; }

        // TODO: Fix projection issues caused by read-only values
        [BsonIgnore]
        public List<UserProjection> ParticipantsWithNames { get; set; }

        [BsonIgnore]
        public bool HasGameEnded => CurrentGameState is GameEndedState;

        [BsonIgnore]
        public bool HasGameStarted => !(CurrentGameState is GameNotStartedState);

        public GameRoom(string name, string ownerId)
        {
            Name = name;
            Owner = ownerId;
            GameOptions = new GameOptions();
            CurrentGameState = new GameNotStartedState(this);
            Participants = new List<string>();
        }
    }
}
