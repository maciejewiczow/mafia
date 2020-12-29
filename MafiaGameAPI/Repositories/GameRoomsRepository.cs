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
                { "_id", new BsonDocument("$toString", "$_id") },
                { "name", 1 },
                { "isGameStarted", 1 },
                { "maxPlayers", "$gameOptions.maxPlayers" },
                { "currentPlayersCount", new BsonDocument("$size", "$participants") }
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

        public async Task<GameRoom> GetRoomById(String roomId)
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
            room.ParticipantsWithNames = await GetParticipantsWithNames(room.Participants);
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

            try
            {
                await _usersCollection.UpdateOneAsync(userFilter, userUpdate);
                await _gameRoomsCollection.UpdateOneAsync(roomFilter, roomUpdate);
            }
            catch (Exception)
            {
                throw;
            }
            return await GetRoomById(roomId);
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
            room.ParticipantsWithNames = await GetParticipantsWithNames(room.Participants);
            return room;
        }

        // FIXME: prosze zrób to inaczej
        private async Task<List<UserProjection>> GetParticipantsWithNames(List<string> users)
        {
            List<UserProjection> participants = new List<UserProjection>();
            foreach (string item in users)
            {
                participants.Add(await GetUserById(item));
            }
            return participants;
        }
        private async Task<UserProjection> GetUserById(String userId)
        {
            var project = new BsonDocument
            {
                { "_id", new BsonDocument("$toString", "$_id") },
                { "name", 1 },
                { "roomId", 1 },
            };
            return await _usersCollection
                .Find(Builders<User>.Filter.Eq("_id", ObjectId.Parse(userId)))
                .Project<UserProjection>(project)
                .FirstOrDefaultAsync();
        }

        public async Task<GameOptions> SetOptions(String roomId, GameOptions options)
        {
            var objectRoomId = ObjectId.Parse(roomId);

            var roomFilter = Builders<GameRoom>
                .Filter.Eq(r => r.Id, objectRoomId);

            var roomUpdate = Builders<GameRoom>.Update
                .Set<GameOptions>(e => e.GameOptions, options);
            try
            {
                await _gameRoomsCollection.UpdateOneAsync(roomFilter, roomUpdate);
            }
            catch (Exception)
            {
                throw;
            }
            return options;
        }
    }
}
