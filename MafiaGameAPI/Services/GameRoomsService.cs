using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MafiaGameAPI.Models;
using MafiaGameAPI.Models.Projections;
using MafiaGameAPI.Repositories;

namespace MafiaGameAPI.Services 
{
	public class GameRoomsService : IGameRoomsService  
	{
		private IGameRoomsRepository _gameRoomsRepository;
		public GameRoomsService(IGameRoomsRepository gameRoomsRepository)
		{
			_gameRoomsRepository = gameRoomsRepository;
		}
		public List<GameRoomProjection> GetRooms() 
		{
			throw new NotImplementedException("Not implemented");
		}
		public GameRoom JoinRoom(String roomId, String userId) 
		{
			throw new NotImplementedException("Not implemented");
		}
		public async Task<GameRoom> CreateRoom(String userId) 
		{
			return await _gameRoomsRepository.CreateRoom(userId, "asd");
		}
		public GameRoom JoinRoom(String roomId) 
		{
			throw new NotImplementedException("Not implemented");
		}

	}

}
