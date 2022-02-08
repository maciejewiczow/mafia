using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MafiaGameAPI.Helpers;
using MafiaGameAPI.Models;
using MafiaGameAPI.Models.DTO;
using Microsoft.AspNetCore.SignalR;

namespace MafiaGameAPI.Hubs
{
    public partial class GameChatHub : Hub<IGameChatClient>
    {
        // TODO: Dodać autoryzację roli: admin pokoju ([Authorize(Role = RoomAdmin)] czy coś w tym stylu)
        public async Task<GameState> StartGame()
        {
            var roomId = await _gameRoomsService.GetRoomIdByUserId(Context.User.Identity.Name);
            var state = await _gameService.StartGame(roomId, Context.User.Identity.Name);
            var groupName = IdentifiersHelper.GenerateRoomGroupName(roomId);

            await Clients.OthersInGroup(groupName).GameStartedAsync();
            await Clients.Groups(groupName).UpdateGameStateAsync(state);

            return state;
        }

        public async Task AddMeToGroupsOnGameStart() {
            var roomId = await _gameRoomsService.GetRoomIdByUserId(Context.User.Identity.Name);
            var room = await _gameRoomsService.GetRoomById(roomId);

            var groupNames = room.CurrentGameState
                .GetUserChatGroups(Context.User.Identity.Name)
                .Select(chatType => IdentifiersHelper.GenerateChatGroupName(roomId, chatType));

            var user = await _gameRoomsService.GetUserById(Context.User.Identity.Name);
            foreach (string chatGroupName in groupNames)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, chatGroupName);
                await Clients.Groups(chatGroupName).UserConnectedAsync(user);
            }
        }

        public async Task Vote(String votedUserId)
        {
            var roomId = await _gameRoomsService.GetRoomIdByUserId(Context.User.Identity.Name);

            await _gameService.Vote(roomId, Context.User.Identity.Name, votedUserId);
        }
    }
}
