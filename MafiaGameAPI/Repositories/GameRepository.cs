using System;
using System.Threading.Tasks;
using MafiaGameAPI.Models;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;
using System.Linq;
using MongoDB.Bson.Serialization;

namespace MafiaGameAPI.Repositories
{
    public class GameRepository : IGameRepository
    {
        private readonly IMongoCollection<GameRoom> _gameRoomsCollection;

        public GameRepository(IMongoClient mongoClient)
        {
            var camelCaseConvention = new ConventionPack { new CamelCaseElementNameConvention() };
            ConventionRegistry.Register("CamelCase", camelCaseConvention, type => true);
            _gameRoomsCollection = mongoClient.GetDatabase("mafia").GetCollection<GameRoom>("gameRooms");
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
                await _gameRoomsCollection.FindOneAndUpdateAsync(filter, updateIsGameStarted);
                await _gameRoomsCollection.FindOneAndUpdateAsync(filter, updateGameState);
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

            GameRoom result;
            try
            {
                result = await _gameRoomsCollection.FindOneAndUpdateAsync(filter, update);
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

            var updateVotes = Builders<GameRoom>.Update.Push<VoteState>(
                r => r.GameHistory
                        .OrderByDescending(s => s.VotingStart)
                        .FirstOrDefault().VoteState,
                vote
            );

            try
            {
                await _gameRoomsCollection.FindOneAndUpdateAsync(filter, updateVotes);
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

            throw new System.NotImplementedException("Not implemented");
        }
    }
}
