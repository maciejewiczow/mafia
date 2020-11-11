using System;

namespace MafiaGameAPI.Repositories {
	public class GameRoomsRepository : IGameRoomsRepository<Message>  {
		public List<MafiaGameAPI.Models.Projections.GameRoomProjection> GetRooms() {
			throw new System.NotImplementedException("Not implemented");
		}
		public MafiaGameAPI.Models.GameRoom AddRoomParticipant(ref String._roomId_:_String userId) {
			throw new System.NotImplementedException("Not implemented");
		}
		public MafiaGameAPI.Models.GameRoom CreateRoom(ref String ownerId, ref String name) {
			throw new System.NotImplementedException("Not implemented");
		}

	}

}
