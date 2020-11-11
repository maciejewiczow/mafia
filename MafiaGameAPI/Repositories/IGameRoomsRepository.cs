using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MafiaGameAPI.Models;
using MafiaGameAPI.Models.Projections;

namespace MafiaGameAPI.Repositories 
{
	public interface IGameRoomsRepository 
	{
		Task<List<GameRoomProjection>> GetRooms();
		Task<GameRoom> AddRoomParticipant(String roomId, String userId);
		Task<GameRoom> CreateRoom(String ownerId, String name);
	}
}
