using System;
using System.Collections.Generic;
using MafiaGameAPI.Models;
using MafiaGameAPI.Models.Projections;

namespace MafiaGameAPI.Repositories {
	public class GameRoomsRepository : IGameRoomsRepository  {
		public List<GameRoomProjection> GetRooms() {
			throw new NotImplementedException("Not implemented");
		}
		public GameRoom AddRoomParticipant(String roomId, String userId) {
			throw new NotImplementedException("Not implemented");
		}
		public GameRoom CreateRoom(String ownerId, String name) {
			throw new NotImplementedException("Not implemented");
		}

	}

}
