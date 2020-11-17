using System;
using Microsoft.AspNetCore.SignalR;
using MafiaGameAPI.Enums;
using MafiaGameAPI.Services;
using MafiaGameAPI.Helpers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

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

        public async Task SendMessage(ChatTypeEnum chatType, String content)
        {
            var roomId = await _gameRoomsService.GetRoomIdByUserId(Context.User.Identity.Name);
            var message = await _chatService.SendMessage(Context.User.Identity.Name, roomId, chatType, content);

            await Clients.Groups(message.GroupName).MessageAsync(message);
        }

        public override async Task OnConnectedAsync()
        {
            // FIXME: sprawdzić czy gra w której jest gracz się rozpoczęła i dodać go do reszty chatów oprócz generalnego

            var roomId = await _gameRoomsService.GetRoomIdByUserId(Context.User.Identity.Name);
            var user = await _gameRoomsService.GetUserById(Context.User.Identity.Name);

            var groupName = IdentifiersHelper.GenerateChatGroupName(roomId, ChatTypeEnum.General);

            await Groups.AddToGroupAsync(Context.User.Identity.Name, groupName);
            await Clients.Groups(groupName).UserConnectedAsync(user);

            await base.OnConnectedAsync();
        }
        }
    }
}
