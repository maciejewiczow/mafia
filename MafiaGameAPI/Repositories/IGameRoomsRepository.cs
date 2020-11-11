using System;
using System.Collections.Generic;
using MafiaGameAPI.Models;
using MafiaGameAPI.Models.Projections;

namespace MafiaGameAPI.Repositories 
{
	public interface IGameRoomsRepository 
	{
		List<GameRoomProjection> GetRooms();
		GameRoom AddRoomParticipant(String roomId, String userId);
		GameRoom CreateRoom(String ownerId, String name);
	}
}
