using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MafiaGameAPI.Models;
using MafiaGameAPI.Models.DTO.Projections;

namespace MafiaGameAPI.Services
{
    public interface IGameRoomsService
    {
        Task<List<GameRoomProjection>> GetRooms();
        Task<GameRoom> JoinRoom(String roomId);
        Task<GameRoom> CreateRoom(String userId);
    }
}
