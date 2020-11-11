using System;
using System.Collections.Generic;
using MafiaGameAPI.Models;
using MafiaGameAPI.Models.Projections;
using MafiaGameAPI.Repositories;

namespace MafiaGameAPI.Services {
	public class GameRoomsService : IGameRoomsService  {
		private IGameRoomsRepository _gameRoomsRepository;

		public List<GameRoomProjection> GetRooms() {
			throw new NotImplementedException("Not implemented");
		}
		public GameRoom JoinRoom(String roomId, String userId) {
			throw new NotImplementedException("Not implemented");
		}
		public GameRoom CreateRoom(String userId) {
			throw new NotImplementedException("Not implemented");
		}
		public GameRoom JoinRoom(String roomId) {
			throw new NotImplementedException("Not implemented");
		}

	}

}
