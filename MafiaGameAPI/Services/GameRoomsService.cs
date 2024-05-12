using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MafiaGameAPI.Models;
using MafiaGameAPI.Helpers;
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
            var room = await GetRoomById(roomId);

            if (room.HasGameStarted)
                throw new Exception("The game in this room has already started");

            if (room.HasGameEnded)
                throw new Exception("Game in this room already ended");

            return await _gameRoomsRepository.AddRoomParticipant(roomId, userId);
        }

        public async Task<GameRoom> CreateRoom(String roomName, String userId)
        {
            GameRoom room = new GameRoom(roomName, userId);
            room = await _gameRoomsRepository.CreateRoom(room);
            return await _gameRoomsRepository.AddRoomParticipant(room.Id.ToString(), userId);
        }

        public async Task<String> GetRoomIdByUserId(string userId)
        {
            return await _usersRepository.GetRoomId(userId);
        }

        public async Task<UserProjection> GetUserProjectionById(string userId)
        {
            return await _usersRepository.GetUserProjectionById(userId);
        }

        public async Task<User> GetUserById(string userId)
        {
            return await _usersRepository.GetUserById(userId);
        }

        public async Task<GameRoom> GetRoomById(String roomId)
        {
            return await _gameRoomsRepository.GetRoomById(roomId);
        }

        public async Task<GameOptions> UpdateOptions(String roomId, GameOptions options)
        {
            return await _gameRoomsRepository.SetOptions(roomId, options);
        }
    }
}
