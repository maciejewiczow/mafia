using System;
using System.Threading.Tasks;
using MafiaGameAPI.Models;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Collections.Generic;

namespace MafiaGameAPI.Repositories
{
    public class GameRepository : IGameRepository
    {
        private readonly IMongoCollection<GameRoom> _gameRoomsCollection;
        private readonly IMongoCollection<User> _usersCollection;

        public GameRepository(IMongoClient mongoClient)
        {
            _gameRoomsCollection = mongoClient.GetDatabase("mafia").GetCollection<GameRoom>("gameRooms");
            _usersCollection = mongoClient.GetDatabase("mafia").GetCollection<User>("users");
        }

        public async Task ChangePhase(String roomId, GameState state)
        {
            var objectRoomId = ObjectId.Parse(roomId);

            var filter = Builders<GameRoom>
                .Filter.Eq(r => r.Id, objectRoomId);

            var update = Builders<GameRoom>.Update
                .Set<GameState>(r => r.CurrentGameState, state);

            try
            {
                await _gameRoomsCollection.UpdateOneAsync(filter, update);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<VoteState> Vote(String roomId, VoteState vote)
        {
            var objectRoomId = ObjectId.Parse(roomId);

            var filter = Builders<GameRoom>
                .Filter.Eq(r => r.Id, objectRoomId);

            var room = await GetRoomById(roomId);
            room.CurrentGameState.VoteState.Add(vote);
            var updateGameState = Builders<GameRoom>.Update
                .Set<GameState>(r => r.CurrentGameState, room.CurrentGameState);

            try
            {
                await _gameRoomsCollection.FindOneAndUpdateAsync(filter, updateGameState);
            }
            catch (Exception)
            {
                throw;
            }

            return vote;
        }

        public async Task<GameState> GetCurrentState(String roomId)
        {
            var objectRoomId = ObjectId.Parse(roomId);

            var filter = Builders<GameRoom>
                .Filter.Where(r => r.Id.Equals(objectRoomId));

            GameState currentState;
            try
            {
                var room = await _gameRoomsCollection
                    .Find(filter)
                    .FirstAsync();
                currentState = room.CurrentGameState;
            }
            catch (Exception)
            {
                throw;
            }

            return currentState;
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
    }
}
