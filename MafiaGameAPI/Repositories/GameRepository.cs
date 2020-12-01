using System;
using System.Threading.Tasks;
using MafiaGameAPI.Models;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;
using System.Linq;
using MongoDB.Bson.Serialization;
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

        public async Task<GameState> StartGame(String roomId, GameState state)
        {
            var objectRoomId = ObjectId.Parse(roomId);

            var filter = Builders<GameRoom>
                .Filter.Eq(r => r.Id, objectRoomId);

            var updateGameState = Builders<GameRoom>.Update
                .Push<GameState>(r => r.GameHistory, state);

            var updateIsGameStarted = Builders<GameRoom>.Update
                .Set<bool>(r => r.IsGameStarted, true);

            var updateCurrentGameState = Builders<GameRoom>.Update
                .Set<String>(r => r.CurrentGameStateId, state.Id);

            try
            {
                await _gameRoomsCollection.UpdateOneAsync(filter, updateIsGameStarted);
                await _gameRoomsCollection.UpdateOneAsync(filter, updateGameState);
                await _gameRoomsCollection.UpdateOneAsync(filter, updateCurrentGameState);
            }
            catch (Exception)
            {
                throw;
            }

            return state;
        }

        public async Task ChangePhase(String roomId, GameState state)
        {
            var objectRoomId = ObjectId.Parse(roomId);
            var filter = Builders<GameRoom>
                .Filter.Eq(r => r.Id, objectRoomId);
            var update = Builders<GameRoom>.Update
                .Push<GameState>(r => r.GameHistory, state);
            var updateGameState = Builders<GameRoom>.Update
                .Set<String>(r => r.CurrentGameStateId, state.Id);
            
            try
            {
                await _gameRoomsCollection.UpdateOneAsync(filter, update);
                await _gameRoomsCollection.UpdateOneAsync(filter, updateGameState);
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

            //var updateVotes = Builders<GameRoom>.Update.Push<VoteState>(
            //    r => r.GameHistory.Where(s => s.Id.Equals(GetCurrentGameStateId(roomId)))
            //            .FirstOrDefault().VoteState,
            //    vote
            //);
            
            var room = await GetRoomById(roomId);
            var stateId = await GetCurrentGameStateId(roomId);
            room.GameHistory.Where(s => s.Id.Equals(stateId)).First().VoteState.Add(vote);
            var updateGameState = Builders<GameRoom>.Update
                .Set<List<GameState>>(r => r.GameHistory, room.GameHistory);

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
            var currentStateId = await GetCurrentGameStateId(roomId);
            var objectRoomId = ObjectId.Parse(roomId);

            var filter = Builders<GameRoom>
                .Filter.Where(r => r.Id.Equals(objectRoomId));

            var projection = Builders<GameRoom>.Projection
                .ElemMatch(r => r.GameHistory, s => s.Id.Equals(currentStateId));

            GameState currentState;
            try
            {
                var bson = await _gameRoomsCollection
                    .Find(filter)
                    .Project(projection)
                    .FirstAsync();

                bson = bson.GetElement("gameHistory").Value.AsBsonArray[0].AsBsonDocument;
                currentState = BsonSerializer.Deserialize<GameState>(bson);
            }
            catch (Exception)
            {
                throw;
            }

            return currentState;
        }

        public async Task<String> GetCurrentGameStateId(String roomId)
        {
            var objectRoomId = ObjectId.Parse(roomId);

            var filter = Builders<GameRoom>.Filter.
                Where(r => r.Id.Equals(objectRoomId));

            var project = Builders<GameRoom>.Projection
                .Include(r => r.CurrentGameStateId).Exclude(r => r.Id);

            String currentStateId;
            try
            {
                var result = await _gameRoomsCollection
                    .Find(filter)
                    .Project<GameRoom>(project)
                    .FirstAsync();

                currentStateId = result.CurrentGameStateId;
            }
            catch (Exception)
            {
                throw;
            }

            return currentStateId;
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

        public async Task SetGameEnded(String roomId)
        {
            var objectRoomId = ObjectId.Parse(roomId);

            var filter = Builders<GameRoom>
                .Filter.Eq(r => r.Id, objectRoomId);

            var updateIsGameEnded = Builders<GameRoom>.Update
                .Set<bool>(r => r.IsGameEnded, true);
            
            try
            {
                var room = await _gameRoomsCollection.FindOneAndUpdateAsync(filter, updateIsGameEnded);
                foreach(string userId in room.Participants)
                {
                    var objectUserId = ObjectId.Parse(userId);
                    var userFilter = Builders<User>
                        .Filter.Eq(r => r.Id, objectUserId);
                    var userUpdate = Builders<User>.Update
                        .Set<String>(u => u.RoomId, null);
                    await _usersCollection.UpdateOneAsync(userFilter, userUpdate);
                }
            }
            catch (Exception)
            {
                throw;
            }

        }
    }
}
