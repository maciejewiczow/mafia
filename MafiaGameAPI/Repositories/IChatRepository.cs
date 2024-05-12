using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MafiaGameAPI.Enums;
using MafiaGameAPI.Models;

namespace MafiaGameAPI.Repositories
{
    public interface IChatRepository
    {
        Task<List<Message>> GetMessages(String roomId, ChatTypeEnum chatType);
        Task SendMessage(Message message);
    }
}
