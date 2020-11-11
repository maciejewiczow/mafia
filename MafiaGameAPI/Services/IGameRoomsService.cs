using System;

namespace MafiaGameAPI.Services {
	public interface IGameRoomsService {
		List<MafiaGameAPI.Models.Projections.GameRoomProjection> GetRooms();
		MafiaGameAPI.Models.GameRoom JoinRoom(ref String roomId);
		MafiaGameAPI.Models.GameRoom CreateRoom(ref String userId);

	}

}
