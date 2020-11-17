using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MafiaGameAPI.Enums;
using MafiaGameAPI.Models;
using MafiaGameAPI.Repositories;
using MafiaGameAPI.Helpers;

namespace MafiaGameAPI.Services
{
    public class ChatService : IChatService
    {
        private readonly IChatRepository _chatRepository;

        public ChatService(IChatRepository chatRepository)
        {
            _chatRepository = chatRepository;
        }

        public async Task<List<Message>> GetMessages(String groupName)
        {
            return await _chatRepository.GetMessages(groupName);
        }

        public async Task<Message> SendMessage(String userId, String roomId, ChatTypeEnum chatType, String content)
        {
            // TODO: sprawdź, czy użytkownik ma prawo wysłać wiadomość na chacie na którym próbuje to zrobić (rola itd)
            Message message = new Message()
            {
                UserId = userId,
                SentAt = DateTime.Now,
                Content = content,
                GroupName = IdentifiersHelper.GenerateChatGroupName(roomId, chatType)
            };
            await _chatRepository.SendMessage(message);
            return message;
        }
    }
}
