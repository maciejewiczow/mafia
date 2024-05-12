using System;
using MafiaGameAPI.Enums;

namespace MafiaGameAPI.Models.DTO
{
    public class SendMessageDTO
    {
        public String Content { get; set; }
        public ChatTypeEnum ChatType { get; set; }
    }
}
