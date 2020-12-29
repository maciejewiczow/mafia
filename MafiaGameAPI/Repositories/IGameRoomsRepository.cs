using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MafiaGameAPI.Models;
using MafiaGameAPI.Models.DTO.Projections;

namespace MafiaGameAPI.Repositories
{
    public interface IGameRoomsRepository
    {
        Task<List<GameRoomProjection>> GetRooms();
        Task<GameRoom> GetRoomById(String roomId);
        Task<GameRoom> AddRoomParticipant(String roomId, String userId);
        Task<GameRoom> CreateRoom(GameRoom room);
        Task<GameOptions> SetOptions(String roomId, GameOptions options);
        GameOptions GetOptionsByRoomId(String roomId);
    }
}
