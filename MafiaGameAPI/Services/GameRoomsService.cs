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
		public async Task<List<GameRoomProjection>> GetRooms() 
		{
			return await _gameRoomsRepository.GetRooms();
		}
		public async Task<GameRoom> JoinRoom(String roomId, String userId) 
		{
			return await _gameRoomsRepository.AddRoomParticipant(roomId, userId);
		}
		public async Task<GameRoom> CreateRoom(String roomName, String userId) 
		{
			GameRoom room = new GameRoom(roomName, userId);
			return await _gameRoomsRepository.CreateRoom(room);
		}

	}

}
