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
            return await _gameRoomsRepository.AddRoomParticipant(roomId, userId);
        }

        public async Task<GameRoom> CreateRoom(String roomName, String userId)
        {
            IOptionsBuilder builder = new OptionsBuilder();
            GameRoom room = new GameRoom(roomName, userId);

            room.GameOptions = builder.BuildDefaultOptions().Build();

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

        public async Task<GameOptions> UpdateOptions(String roomId, int maxPlayers, int minutes, int mafiosoCount, bool isPublic, bool areVotesVisible)
        {
            IOptionsBuilder builder = new OptionsBuilder();
            var options = builder
                    .NewOptions()
                    .SetMaxPlayers(maxPlayers)
                    .SetPhaseDuration(minutes)
                    .SetMafiosoCount(mafiosoCount)
                    .SetIsPublic(isPublic)
                    .SetAreVotesVisible(areVotesVisible)
                    .Build();
            return await _gameRoomsRepository.SetOptions(roomId, options);
        }
    }
}
