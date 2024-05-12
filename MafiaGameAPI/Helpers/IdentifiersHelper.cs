using System;
using MafiaGameAPI.Enums;

namespace MafiaGameAPI.Helpers
{
    public static class IdentifiersHelper
    {
        public static string GenerateChatGroupName(String roomId, ChatTypeEnum chatType)
        {
            return roomId + chatType.ToString("g");
        }

        public static string GenerateRoomGroupName(String roomId)
        {
            return roomId + "GameGroup";
        }

        public static string CreateGuidString()
        {
            return Guid.NewGuid().ToString("D");
        }
    }
}
