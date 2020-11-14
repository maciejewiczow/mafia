using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MafiaGameAPI.Models;
using MafiaGameAPI.Models.DTO.Projections;
using MongoDB.Driver;
using MongoDB.Bson;

namespace MafiaGameAPI.Repositories
{
    public class GameRoomsRepository : IGameRoomsRepository
    {
        private readonly IMongoCollection<GameRoom> _gameRoomsCollection;

        public GameRoomsRepository(IMongoClient mongoClient)
        {
            _gameRoomsCollection = mongoClient.GetDatabase("mafia").GetCollection<GameRoom>("gameRooms");
        }

        public async Task<List<GameRoomProjection>> GetRooms()
        {
            var project = new BsonDocument
            {
                { "_id",
                new BsonDocument("$toString", "$_id") },
                { "name", 1 },
                { "isGameStarted", 1 },
                { "maxPlayers", "$gameOptions.maxPlayers" },
                { "currentPlayersCount",
                new BsonDocument("$size", "$participants") }
            };

            var rooms = await _gameRoomsCollection
                .Find(Builders<GameRoom>.Filter.Empty)
                .Project<GameRoomProjection>(project)
                .ToListAsync();

            return rooms;
        }

        public async Task<GameRoom> AddRoomParticipant(String roomId, String userId)
        {
            throw new NotImplementedException("Not implemented");
        }

        public async Task<GameRoom> CreateRoom(String ownerId, String name)
        {
            var gameRoom = new GameRoom(name, new User());
            await _gameRoomsCollection.InsertOneAsync(gameRoom);
            return gameRoom;
        }
    }
}
