using System;
using Microsoft.AspNetCore.SignalR;
using MafiaGameAPI.Enums;
using MafiaGameAPI.Services;
using MafiaGameAPI.Helpers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using MafiaGameAPI.Models.DTO;
using System.Linq;
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

        public async Task SendMessage(SendMessageDTO messageDTO)
        {
            var roomId = await _gameRoomsService.GetRoomIdByUserId(Context.User.Identity.Name);
            var message = await _chatService.SendMessage(Context.User.Identity.Name, roomId, messageDTO.ChatType, messageDTO.Content);

            await Clients.Groups(message.GroupName).MessageAsync(message);
        }

        public override async Task OnConnectedAsync()
        {
            var roomId = await _gameRoomsService.GetRoomIdByUserId(Context.User.Identity.Name);
            var room = await _gameRoomsService.GetRoomById(roomId);
            List<string> groupNames = new List<string>();
            if(room.IsGameStarted)
            {
                var state = await _gameService.GetCurrentState(roomId);
                var userState = state.UserStates.First(u => u.UserId.Equals(Context.User.Identity.Name));
                if((userState.Role & RoleEnum.Mafioso) != 0)
                {
                    groupNames.Add(IdentifiersHelper.GenerateChatGroupName(roomId, ChatTypeEnum.Mafia));
                }
                groupNames.Add(IdentifiersHelper.GenerateChatGroupName(roomId, ChatTypeEnum.Citizen));
            }
            var user = await _gameRoomsService.GetUserById(Context.User.Identity.Name);

            groupNames.Add(IdentifiersHelper.GenerateChatGroupName(roomId, ChatTypeEnum.General));

            foreach(string groupName in groupNames)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
                await Clients.Groups(groupName).UserConnectedAsync(user);
            }

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
