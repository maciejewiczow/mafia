using System;
using System.Collections.Generic;
using MafiaGameAPI.Models;
using MafiaGameAPI.Models.Projections;

namespace MafiaGameAPI.Services {
	public interface IGameRoomsService {
		List<GameRoomProjection> GetRooms();
		GameRoom JoinRoom(String roomId);
		GameRoom CreateRoom(String userId);
	}
}
