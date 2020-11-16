using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MafiaGameAPI.Enums;
using MafiaGameAPI.Models;
using MafiaGameAPI.Repositories;

namespace MafiaGameAPI.Services
{
    public class ChatService : IChatService
    {
        private IChatRepository _chatRepository;
        private string GenerateGroupName(String roomId, ChatTypeEnum chatType)
        {
            return roomId + "" + chatType.ToString("g");
        }
        public ChatService(IChatRepository chatRepository)
        {
            _chatRepository = chatRepository;
        }
        public async Task<List<Message>> GetMessages(String groupName)
        {
            return await _chatRepository.GetMessages(groupName);
        }
        public async Task SendMessage(String userId, String roomId, ChatTypeEnum chatType, String content)
        {
            Message message = new Message()
            {
                UserId = userId,
                SentAt = DateTime.Now,
                Content = content,
                GroupName = GenerateGroupName(roomId, chatType)
            };
            await _chatRepository.SendMessage(message);
        }
    }
}
