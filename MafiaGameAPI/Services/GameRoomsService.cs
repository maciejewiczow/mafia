using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MafiaGameAPI.Models;
using MafiaGameAPI.Models.DTO.Projections;
using MafiaGameAPI.Repositories;

namespace MafiaGameAPI.Services
{
    public class GameRoomsService : IGameRoomsService
    {
        private IGameRoomsRepository _gameRoomsRepository;
        public GameRoomsService(IGameRoomsRepository gameRoomsRepository)
        {
            _gameRoomsRepository = gameRoomsRepository;
        }
        public async Task<List<GameRoomProjection>> GetRooms()
        {
            return await _gameRoomsRepository.GetRooms();
        }
        public async Task<GameRoom> JoinRoom(String roomId, String userId)
        {
            throw new NotImplementedException("Not implemented");
        }
        public async Task<GameRoom> CreateRoom(String userId)
        {
            return await _gameRoomsRepository.CreateRoom(userId, "asd");
        }
        public async Task<GameRoom> JoinRoom(String roomId)
        {
            throw new NotImplementedException("Not implemented");
        }

    }

}
