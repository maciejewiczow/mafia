using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MafiaGameAPI.Models;
using MafiaGameAPI.Models.DTO.Projections;
using MafiaGameAPI.Repositories;
using MafiaGameAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MafiaGameAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class GameRoomsController : ControllerBase
    {
        private readonly IGameRoomsService _gameRoomsService;
        private readonly IUsersRepository _usersRepository;

        public GameRoomsController(IGameRoomsService gameRoomsService, IUsersRepository usersRepository)
        {
            _gameRoomsService = gameRoomsService;
            _usersRepository = usersRepository;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<List<GameRoomProjection>> GetRooms()
        {
            return await _gameRoomsService.GetRooms();
        }

        [HttpGet("getRoom/{roomId}")]
        public async Task<GameRoom> GetRoomById([FromRoute] String roomId)
        {
            return await _gameRoomsService.GetRoomById(roomId);
        }

        [HttpGet("current")]
        public async Task<GameRoom> GetRoomByUserId()
        {
            var roomId = (await _usersRepository.GetUserById(User.Identity.Name)).RoomId;
            return await _gameRoomsService.GetRoomById(roomId);
        }

        [HttpPost("create")]
        public async Task<GameRoom> CreateRoom(String name)
        {
            return await _gameRoomsService.CreateRoom(name, User.Identity.Name);
        }

        [HttpPost("join/{roomId}")]
        public async Task<GameRoom> JoinRoom([FromRoute] String roomId)
        {
            return await _gameRoomsService.JoinRoom(roomId, User.Identity.Name);
        }

        [HttpPut("options/{roomId}")]
        public async Task<GameOptions> UpdateOptions([FromRoute] String roomId, int maxPlayers, int minutes, int mafiosoCount, bool isPublic, bool areVotesVisible)
        {
            // TODO: weryfikacja czy user może zmieniać opcje gry (najlepiej, żeby mógł tylko owner)
            return await _gameRoomsService.UpdateOptions(roomId, maxPlayers, minutes, mafiosoCount, isPublic, areVotesVisible);
        }
    }
}
