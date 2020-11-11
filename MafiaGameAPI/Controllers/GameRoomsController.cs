using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MafiaGameAPI.Models;
using MafiaGameAPI.Models.Projections;
using MafiaGameAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace MafiaGameAPI.Controllers 
{
	[Route("api/[controller]")]
    [ApiController]
	public class GameRoomsController : ControllerBase 
	{
		private IGameRoomsService _gameRoomsService;
		public GameRoomsController(IGameRoomsService gameRoomsService)
		{
			_gameRoomsService = gameRoomsService;
		}
		[HttpGet]
		public List<GameRoomProjection> GetRooms() 
		{
			return new List<GameRoomProjection>();
			//throw new System.NotImplementedException("Not implemented");
		}
		[HttpPost("create")]
		public async Task<GameRoom> CreateRoom(String name) 
		{
			return await _gameRoomsService.CreateRoom(name);
		}

	}

}
