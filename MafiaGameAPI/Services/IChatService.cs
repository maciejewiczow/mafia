using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MafiaGameAPI.Enums;
using MafiaGameAPI.Models;

namespace MafiaGameAPI.Services
{
    public interface IChatService
    {
        Task<List<Message>> GetMessages(String groupName);
        Task<Message> SendMessage(String userId, String roomId, ChatTypeEnum chatType, String content);
    }
}
