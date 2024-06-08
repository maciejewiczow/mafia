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
using MafiaGameAPI.Repositories;

namespace MafiaGameAPI.Hubs
{
    [Authorize]
    public partial class GameChatHub : Hub<IGameChatClient>
    {
        private readonly IChatService _chatService;
        private readonly IGameRoomsService _gameRoomsService;
        private readonly IGameService _gameService;
        private readonly IChatRepository _chatRepository;

        public GameChatHub(
            IChatService chatService,
            IGameRoomsService gameRoomsService,
            IGameService gameService,
            IChatRepository chatRepository
        )
        {
            _chatService = chatService;
            _gameRoomsService = gameRoomsService;
            _gameService = gameService;
            _chatRepository = chatRepository;
        }

        public override async Task OnConnectedAsync()
        {
            var roomId = await _gameRoomsService.GetRoomIdByUserId(Context.User.Identity.Name);
            var room = await _gameRoomsService.GetRoomById(roomId);
            var user = await _gameRoomsService.GetUserById(Context.User.Identity.Name);

            foreach (ChatTypeEnum chatType in room.CurrentGameState.GetUserChatGroups(Context.User.Identity.Name))
            {
                var groupName = IdentifiersHelper.GenerateChatGroupName(roomId, chatType);
                await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
                await Clients.Groups(groupName).UserConnectedAsync(user, chatType);
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, IdentifiersHelper.GenerateRoomGroupName(roomId));

            var messages = await _chatService.GetMessagesForUser(Context.User.Identity.Name, roomId);
            await Clients.Caller.MessagesOnConnectedAsync(messages);

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var user = await _gameRoomsService.GetUserById(Context.User.Identity.Name);
            var roomId = user.RoomId;

            // instead call service method to remove the disconnected user from room after a delay, if it was their last connection
            // this needs connection counting per room participant to be implemented

            foreach (ChatTypeEnum chatType in Enum.GetValues(typeof(ChatTypeEnum)))
            {
                var groupName = IdentifiersHelper.GenerateChatGroupName(roomId, chatType);
                await Clients.OthersInGroup(groupName).UserDisconnectedAsync(user, chatType);
            }

            // await Clients.OthersInGroup(IdentifiersHelper.GenerateRoomGroupName(roomId))
            //     .UserDisconnectedAsync(user);

            await base.OnDisconnectedAsync(exception);
        }
    }
}
