using System;
using Microsoft.AspNetCore.SignalR;
using MafiaGameAPI.Enums;
using MafiaGameAPI.Services;
using MafiaGameAPI.Helpers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using MafiaGameAPI.Models.DTO;

namespace MafiaGameAPI.Hubs
{
    [Authorize]
    public class ChatHub : Hub<IChatClient>
    {
        private readonly IChatService _chatService;
        private readonly IGameRoomsService _gameRoomsService;

        public ChatHub(IChatService chatService, IGameRoomsService gameRoomsService)
        {
            _chatService = chatService;
            _gameRoomsService = gameRoomsService;
        }

        public async Task SendMessage(SendMessageDTO messageDTO)
        {
            var roomId = await _gameRoomsService.GetRoomIdByUserId(Context.User.Identity.Name);
            var message = await _chatService.SendMessage(Context.User.Identity.Name, roomId, messageDTO.ChatType, messageDTO.Content);

            await Clients.Groups(message.GroupName).MessageAsync(message);
        }

        public override async Task OnConnectedAsync()
        {
            // FIXME: sprawdzić czy gra w której jest gracz się rozpoczęła i dodać go do reszty chatów oprócz generalnego

            var roomId = await _gameRoomsService.GetRoomIdByUserId(Context.User.Identity.Name);
            var user = await _gameRoomsService.GetUserById(Context.User.Identity.Name);

            var groupName = IdentifiersHelper.GenerateChatGroupName(roomId, ChatTypeEnum.General);

            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            await Clients.Groups(groupName).UserConnectedAsync(user);

            var messages = await _chatService.GetMessagesByUserId(Context.User.Identity.Name, roomId);
            await Clients.Caller.MessagesOnConnectedAsync(messages);

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var roomId = await _gameRoomsService.GetRoomIdByUserId(Context.User.Identity.Name);

            foreach (ChatTypeEnum value in Enum.GetValues(typeof(ChatTypeEnum)))
            {
                var groupName = IdentifiersHelper.GenerateChatGroupName(roomId, value);
                await Clients.Groups(groupName).UserDisconnectedAsync(Context.User.Identity.Name);
            }

            await base.OnDisconnectedAsync(exception);
        }
    }
}
