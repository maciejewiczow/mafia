using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MafiaGameAPI.Helpers;
using MafiaGameAPI.Models.DTO;
using Microsoft.AspNetCore.SignalR;

namespace MafiaGameAPI.Hubs
{
    public partial class GameChatHub : Hub<IGameChatClient>
    {
        public async Task SendMessage(SendMessageDTO messageDTO)
        {
            var roomId = await _gameRoomsService.GetRoomIdByUserId(Context.User.Identity.Name);
            var message = await _chatService.SendMessage(Context.User.Identity.Name, roomId, messageDTO.ChatType, messageDTO.Content);

            await Clients.Groups(IdentifiersHelper.GenerateChatGroupName(roomId, message.ChatType)).MessageAsync(message);
        }
    }
}
