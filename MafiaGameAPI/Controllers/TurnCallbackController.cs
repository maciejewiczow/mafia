using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MafiaGameAPI.Enums;
using MafiaGameAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MafiaGameAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TurnCallbackController : ControllerBase
    {
        private readonly IGameService gameService;

        public TurnCallbackController(IGameService service)
        {
            gameService = service;
        }

        [HttpPost]
        [Authorize(Policy = nameof(TokenType.TurnCallbackToken))]
        public async Task<string> ChangeTurn()
        {
            var gameRoomId = User.Claims.First(claim => claim.Type == "roomId").Value;
            var stateId = User.Claims.First(claim => claim.Type == "stateId").Value;

            await gameService.ChangeTurn(gameRoomId, stateId);

            return "OK";
        }
    }
}
