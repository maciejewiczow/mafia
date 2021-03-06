using System;
using Microsoft.AspNetCore.SignalR;
using MafiaGameAPI.Enums;
using MafiaGameAPI.Services;
using MafiaGameAPI.Helpers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using MafiaGameAPI.Models.DTO;
using System.Collections.Generic;

namespace MafiaGameAPI.Hubs
{
    [Authorize]
    public class ChatHub : Hub<IChatClient>
    {
        private readonly IChatService _chatService;
        private readonly IGameRoomsService _gameRoomsService;
        private readonly IGameService _gameService;

        public ChatHub(IChatService chatService, IGameRoomsService gameRoomsService, IGameService gameService)
        {
            _chatService = chatService;
            _gameRoomsService = gameRoomsService;
            _gameService = gameService;
        }

        // TODO: openapi, testy integracyjne

        public async Task SendMessage(SendMessageDTO messageDTO)
        {
            var roomId = await _gameRoomsService.GetRoomIdByUserId(Context.User.Identity.Name);
            var message = await _chatService.SendMessage(Context.User.Identity.Name, roomId, messageDTO.ChatType, messageDTO.Content);

            await Clients.Groups(IdentifiersHelper.GenerateChatGroupName(roomId, message.ChatType)).MessageAsync(message);
        }

        public override async Task OnConnectedAsync()
        {
            var roomId = await _gameRoomsService.GetRoomIdByUserId(Context.User.Identity.Name);
            var room = await _gameRoomsService.GetRoomById(roomId);

            List<string> groupNames = new List<string>();
            var chatTypes = room.CurrentGameState.GetUserChatGroups(Context.User.Identity.Name);

            foreach (var chatType in chatTypes)
            {
                groupNames.Add(IdentifiersHelper.GenerateChatGroupName(roomId, chatType));
            }

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
            var roomId = await _gameRoomsService.GetRoomIdByUserId(Context.User.Identity.Name);

            foreach (ChatTypeEnum value in Enum.GetValues(typeof(ChatTypeEnum)))
            {
                var groupName = IdentifiersHelper.GenerateChatGroupName(roomId, value);
                await Clients.OthersInGroup(groupName).UserDisconnectedAsync(Context.User.Identity.Name);
            }

            await base.OnDisconnectedAsync(exception);
        }
    }
}
