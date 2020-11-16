using System;
using Microsoft.AspNetCore.SignalR;
using MafiaGameAPI.Enums;
using MafiaGameAPI.Services;
using MafiaGameAPI.Helpers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace MafiaGameAPI.Hubs
{
    public class ChatHub : Hub
    {
        private IChatService _chatService;
        private IGameRoomsService _gameRoomsService;
        public ChatHub(IChatService chatService, IGameRoomsService gameRoomsService)
        {
            _chatService = chatService;
            _gameRoomsService = gameRoomsService;
        }

        [Authorize]
        public async Task SendMessage(ChatTypeEnum chatType, String content)
        {
            var roomId = await _gameRoomsService.GetRoomIdByUserId(Context.User.Identity.Name);
            var message = await _chatService.SendMessage(Context.User.Identity.Name, roomId, chatType, content);
            await Clients.Groups(message.GroupName).SendAsync("ReceiveMessage", message);
        }
        [Authorize]
        public async Task OnConnect()
        {
            var roomId = await _gameRoomsService.GetRoomIdByUserId(Context.User.Identity.Name);
            var groupName = Helper.GenerateGroupName(roomId, ChatTypeEnum.General);
            var user = _gameRoomsService.GetUser(Context.User.Identity.Name);
            await Groups.AddToGroupAsync(Context.User.Identity.Name, groupName);
            await Clients.Groups(groupName).SendAsync("NotifyGroupMembers", user);
        }

    }

}
