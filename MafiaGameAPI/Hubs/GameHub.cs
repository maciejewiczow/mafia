using System;
using System.Threading.Tasks;
using MafiaGameAPI.Helpers;
using MafiaGameAPI.Models;
using MafiaGameAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace MafiaGameAPI.Hubs
{
    [Authorize]
    public class GameHub : Hub
    {
        private readonly IGameService _gameService;
        private readonly IGameRoomsService _gameRoomsService;

        public GameHub(IGameService gameService, IGameRoomsService gameRoomsService)
        {
            _gameService = gameService;
            _gameRoomsService = gameRoomsService;
        }

        public async Task<GameState> StartGame()
        {
            var roomId = await _gameRoomsService.GetRoomIdByUserId(Context.User.Identity.Name);
            var state = await _gameService.StartGame(roomId);
            var groupName = IdentifiersHelper.GenerateRoomGroupName(roomId);

            await Clients.Groups(groupName).SendAsync("SendGameStateToPlayers", state);

            return state;
        }

        public async Task Vote(String votedUserId)
        {
            var roomId = await _gameRoomsService.GetRoomIdByUserId(Context.User.Identity.Name);

            await _gameService.Vote(roomId, Context.User.Identity.Name, votedUserId);
        }

        public async Task<GameRoom> JoinRoom(string roomId)
        {
            var room = await _gameRoomsService.JoinRoom(roomId, Context.User.Identity.Name);
            var user = _gameRoomsService.GetUserById(Context.User.Identity.Name);

            var groupName = IdentifiersHelper.GenerateRoomGroupName(roomId);

            await Groups.AddToGroupAsync(Context.User.Identity.Name, groupName);
            await Clients.Groups(groupName).SendAsync("NotifyGroupMembers", user);

            return room;
        }
    }
}
