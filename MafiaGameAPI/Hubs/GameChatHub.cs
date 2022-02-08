using System;
using Microsoft.AspNetCore.SignalR;
using MafiaGameAPI.Enums;
using MafiaGameAPI.Services;
using MafiaGameAPI.Helpers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using MafiaGameAPI.Models.DTO;
using System.Collections.Generic;
using System.Linq;
using MafiaGameAPI.Models;

namespace MafiaGameAPI.Hubs
{
    [Authorize]
    public partial class GameChatHub : Hub<IGameChatClient>
    {
        private readonly IChatService _chatService;
        private readonly IGameRoomsService _gameRoomsService;
        private readonly IGameService _gameService;

        public GameChatHub(IChatService chatService, IGameRoomsService gameRoomsService, IGameService gameService)
        {
            _chatService = chatService;
            _gameRoomsService = gameRoomsService;
            _gameService = gameService;
        }

        public override async Task OnConnectedAsync()
        {
            var roomId = await _gameRoomsService.GetRoomIdByUserId(Context.User.Identity.Name);
            var room = await _gameRoomsService.GetRoomById(roomId);

            var groupNames = room.CurrentGameState
                .GetUserChatGroups(Context.User.Identity.Name)
                .Select(chatType => IdentifiersHelper.GenerateChatGroupName(roomId, chatType))
                .ToList();

            groupNames.Add(IdentifiersHelper.GenerateRoomGroupName(roomId));

            var user = await _gameRoomsService.GetUserById(Context.User.Identity.Name);
            foreach (string groupName in groupNames)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
                await Clients.Groups(groupName).UserConnectedAsync(user);
            }

            var messages = await _chatService.GetMessagesForUser(Context.User.Identity.Name, roomId);
            await Clients.Caller.MessagesOnConnectedAsync(messages);

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var user = await _gameRoomsService.GetUserById(Context.User.Identity.Name);
            var roomId = user.RoomId;

            foreach (ChatTypeEnum value in Enum.GetValues(typeof(ChatTypeEnum)))
            {
                var groupName = IdentifiersHelper.GenerateChatGroupName(roomId, value);
                await Clients.OthersInGroup(groupName).UserDisconnectedAsync(user);
            }

            await Clients.OthersInGroup(IdentifiersHelper.GenerateRoomGroupName(roomId))
                .UserDisconnectedAsync(user);

            await base.OnDisconnectedAsync(exception);
        }
    }
}
