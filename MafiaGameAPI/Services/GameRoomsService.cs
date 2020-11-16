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
        private readonly IGameRoomsRepository _gameRoomsRepository;
        private readonly IUsersRepository _usersRepository;

        public GameRoomsService(IGameRoomsRepository gameRoomsRepository, IUsersRepository usersRepository)
        {
            _gameRoomsRepository = gameRoomsRepository;
            _usersRepository = usersRepository;
        }

        public async Task<List<GameRoomProjection>> GetRooms()
        {
            return await _gameRoomsRepository.GetRooms();
        }

        public async Task<GameRoom> JoinRoom(String roomId, String userId)
        {
            return await _gameRoomsRepository.AddRoomParticipant(roomId, userId);
        }

        public async Task<GameRoom> CreateRoom(String roomName, String userId)
        {
            GameRoom room = new GameRoom(roomName, userId);
            return await _gameRoomsRepository.CreateRoom(room);
        }

        public async Task<String> GetRoomIdByUserId(string userId)
        {
            return await _usersRepository.GetRoomId(userId);
        }

        public async Task<User> GetUser(string userId)
        {
            return await _usersRepository.GetUserById(userId);
        }
    }
}
