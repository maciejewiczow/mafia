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
    public class GameHub : Hub<IGameClient>
    {
        private readonly IGameService _gameService;
        private readonly IGameRoomsService _gameRoomsService;

        public GameHub(IGameService gameService, IGameRoomsService gameRoomsService)
        {
            _gameService = gameService;
            _gameRoomsService = gameRoomsService;
        }

        // TODO: Dodać autoryzację roli: admin pokoju ([Authorize(Role = RoomAdmin)] czy coś w tym stylu)
        public async Task<GameState> StartGame()
        {
            var roomId = await _gameRoomsService.GetRoomIdByUserId(Context.User.Identity.Name);
            var state = await _gameService.StartGame(roomId);
            var groupName = IdentifiersHelper.GenerateRoomGroupName(roomId);

            await Clients.OthersInGroup(groupName).GameStartedAsync();
            await Clients.Groups(groupName).UpdateGameStateAsync(state);

            return state;
        }

        public async Task Vote(String votedUserId)
        {
            var roomId = await _gameRoomsService.GetRoomIdByUserId(Context.User.Identity.Name);

            var vote = await _gameService.Vote(roomId, Context.User.Identity.Name, votedUserId);

            await Clients.Group(IdentifiersHelper.GenerateRoomGroupName(roomId)).NewVoteAsync(vote);
        }

        public async override Task OnConnectedAsync()
        {
            var user = await _gameRoomsService.GetUserById(Context.User.Identity.Name);

            if (String.IsNullOrEmpty(user.RoomId))
                throw new HubException("You need to be in a room before connecting to this hub");

            var groupName = IdentifiersHelper.GenerateRoomGroupName(user.RoomId);

            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            await Clients.OthersInGroup(groupName).GameMemberConnectedAsync(user);
        }

        public async override Task OnDisconnectedAsync(Exception e)
        {
            var user = await _gameRoomsService.GetUserById(Context.User.Identity.Name);

            var groupName = IdentifiersHelper.GenerateRoomGroupName(user.RoomId);

            await Clients.OthersInGroup(groupName).GameMemberDisconnectedAsync(user);
        }
    }
}
