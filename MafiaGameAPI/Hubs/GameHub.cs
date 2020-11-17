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

        public async Task<GameState> StartGame()
        {
            // TODO: Dodać autoryzację roli: admin pokoju
            var roomId = await _gameRoomsService.GetRoomIdByUserId(Context.User.Identity.Name);
            var state = await _gameService.StartGame(roomId);
            var groupName = IdentifiersHelper.GenerateRoomGroupName(roomId);

            await Clients.Groups(groupName).UpdateGameStateAsync(state);

            return state;
        }

        public async Task Vote(String votedUserId)
        {
            var roomId = await _gameRoomsService.GetRoomIdByUserId(Context.User.Identity.Name);

            // TODO: Sprawdzić czy user może głosować i czy można głosować na votedUserId
            var vote = await _gameService.Vote(roomId, Context.User.Identity.Name, votedUserId);

            await Clients.Group(IdentifiersHelper.GenerateRoomGroupName(roomId)).NewVoteAsync(vote);
        }

        public async override Task OnConnectedAsync()
        {
            var user = await _gameRoomsService.GetUserById(Context.User.Identity.Name);

            if (String.IsNullOrEmpty(user.RoomId))
                throw new HubException("You need to be join a room before connecting to this hub");

            var groupName = IdentifiersHelper.GenerateRoomGroupName(user.RoomId);

            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            await Clients.Groups(groupName).GameMemberConnectedAsync(user);
        }

        public async override Task OnDisconnectedAsync(Exception e)
        {
            var user = await _gameRoomsService.GetUserById(Context.User.Identity.Name);

            var groupName = IdentifiersHelper.GenerateRoomGroupName(user.RoomId);

            await Clients.Groups(groupName).GameMemberDisconnectedAsync(user);
        }
    }
}
