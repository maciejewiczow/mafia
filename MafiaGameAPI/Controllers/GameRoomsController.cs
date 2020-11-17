using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MafiaGameAPI.Models;
using MafiaGameAPI.Models.DTO.Projections;
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
        public GameRoomsController(IGameRoomsService gameRoomsService)
        {
            _gameRoomsService = gameRoomsService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<List<GameRoomProjection>> GetRooms()
        {
            return await _gameRoomsService.GetRooms();
        }

        [HttpPost("create")]
        public async Task<GameRoom> CreateRoom(String name)
        {
            return await _gameRoomsService.CreateRoom(name, User.Identity.Name);
        }

        [HttpPost("join/{id}")]
        public async Task<GameRoom> JoinRoom([FromRoute] String roomId)
        {
            return await _gameRoomsService.JoinRoom(roomId, User.Identity.Name);
        }
    }
}
