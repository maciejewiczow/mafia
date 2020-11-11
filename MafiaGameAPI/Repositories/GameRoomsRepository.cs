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
