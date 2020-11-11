using System;

namespace MafiaGameAPI.Services {
	public class GameRoomsService : IGameRoomsService<Message>  {
		private IGameRoomsRepository _gameRoomsRepository;

		public List<MafiaGameAPI.Models.Projections.GameRoomProjection> GetRooms() {
			throw new System.NotImplementedException("Not implemented");
		}
		public MafiaGameAPI.Models.GameRoom JoinRoom(ref String roomId, ref String userId) {
			throw new System.NotImplementedException("Not implemented");
		}
		public MafiaGameAPI.Models.GameRoom CreateRoom(ref String userId) {
			throw new System.NotImplementedException("Not implemented");
		}
		public MafiaGameAPI.Models.GameRoom JoinRoom(ref String roomId) {
			throw new System.NotImplementedException("Not implemented");
		}

	}

}
