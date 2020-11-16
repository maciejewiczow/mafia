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
        private readonly IMongoCollection<User> _usersCollection;

        public GameRoomsRepository(IMongoClient mongoClient)
        {
            _gameRoomsCollection = mongoClient.GetDatabase("mafia").GetCollection<GameRoom>("gameRooms");
            _usersCollection = mongoClient.GetDatabase("mafia").GetCollection<User>("users");
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

            List<GameRoomProjection> rooms;
            try
            {
                rooms = await _gameRoomsCollection
                    .Find(Builders<GameRoom>.Filter.Empty)
                    .Project<GameRoomProjection>(project)
                    .ToListAsync();
            }
            catch (Exception)
            {
                throw;
            }

            return rooms;
        }

        public async Task<GameRoom> GetRoom(String roomId)
        {
            var objectRoomId = ObjectId.Parse(roomId);
            var filter = Builders<GameRoom>
                .Filter.Where(r => r.Id.Equals(objectRoomId));

            GameRoom room;
            try
            {
                room = await _gameRoomsCollection
                    .Find(filter)
                    .FirstAsync();
            }
            catch (Exception)
            {
                throw;
            }

            return room;
        }

        public async Task<GameRoom> AddRoomParticipant(String roomId, String userId)
        {
            var objectRoomId = ObjectId.Parse(roomId);
            var objectUserId = ObjectId.Parse(userId);
            var roomFilter = Builders<GameRoom>
                .Filter.Eq(r => r.Id, objectRoomId);
            var userFilter = Builders<User>
                .Filter.Eq(r => r.Id, objectUserId);
            var roomUpdate = Builders<GameRoom>.Update
                .Push<String>(e => e.Participants, userId);
            var userUpdate = Builders<User>.Update
                .Set<String>(u => u.RoomId, roomId);

            GameRoom result;
            try
            {
                await _usersCollection.UpdateOneAsync(userFilter, userUpdate);
                result = await _gameRoomsCollection.FindOneAndUpdateAsync(roomFilter, roomUpdate);
            }
            catch (Exception)
            {
                throw;
            }
            return result;
        }

        public async Task<GameRoom> CreateRoom(GameRoom room)
        {
            try
            {
                await _gameRoomsCollection.InsertOneAsync(room);
            }
            catch (Exception)
            {
                throw;
            }
            return room;
        }
    }
}
