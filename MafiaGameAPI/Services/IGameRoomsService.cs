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
        Task<GameRoom> JoinRoom(String roomId, String userId);
        Task<GameRoom> CreateRoom(String roomName, String userId);
        Task<String> GetRoomIdByUserId(string userId);
        Task<UserProjection> GetUserProjectionById(string userId);
        Task<User> GetUserById(string userId);
        Task<GameRoom> GetRoomById(String roomId);
        Task<GameOptions> UpdateOptions(String roomId, int maxPlayers, int minutes, int mafiosoCount, bool isPublic, bool areVotesVisible);
    }
}
