using System;

namespace MafiaGameAPI.Repositories {
	public interface IGameRoomsRepository {
		List<MafiaGameAPI.Models.Projections.GameRoomProjection> GetRooms();
		MafiaGameAPI.Models.GameRoom AddRoomParticipant(ref String._roomId_:_String userId);
		MafiaGameAPI.Models.GameRoom CreateRoom(ref String ownerId, ref String name);

	}

}
