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

            List<GameRoomProjection> rooms;
			try
			{
				rooms = await _gameRoomsCollection
					.Find(Builders<GameRoom>.Filter.Empty)
					.Project<GameRoomProjection>(project)
					.ToListAsync();
			}
			catch(Exception)
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
			catch(Exception)
			{
				throw;
			}
			
			return room;
		}
		public async Task<GameRoom> AddRoomParticipant(String roomId, String userId) 
		{
			var objectRoomId = ObjectId.Parse(roomId);
			var filter = Builders<GameRoom>
            	.Filter.Eq(r => r.Id, objectRoomId);
			var update = Builders<GameRoom>.Update
        		.Push<String>(e => e.Participants, userId);

			GameRoom result;
			try
			{
				result = await _gameRoomsCollection.FindOneAndUpdateAsync(filter, update);
			}
			catch(Exception)
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
			catch(Exception)
			{
				throw;
			}
			return room;
		}

	}

}
