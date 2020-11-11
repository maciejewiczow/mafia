using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MafiaGameAPI.Models;
using MafiaGameAPI.Models.Projections;
using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Conventions;

namespace MafiaGameAPI.Repositories 
{
	public class GameRoomsRepository : IGameRoomsRepository  
	{
		private readonly IMongoCollection<GameRoom> _gameRoomsCollection;
		public GameRoomsRepository(IMongoClient mongoClient)
		{
			var camelCaseConvention = new ConventionPack {new CamelCaseElementNameConvention()};
			ConventionRegistry.Register("CamelCase", camelCaseConvention, type => true);
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
			var objectRoomId = ObjectId.Parse(roomId);
			var filter = Builders<GameRoom>
            	.Filter.Eq(r => r.Id, objectRoomId);
			var update = Builders<GameRoom>.Update
        		.Push<String>(e => e.Participants, userId);

			return await _gameRoomsCollection.FindOneAndUpdateAsync(filter, update);
		}
		public async Task<GameRoom> CreateRoom(GameRoom room) 
		{
			await _gameRoomsCollection.InsertOneAsync(room);
			return room;
		}

	}

}
