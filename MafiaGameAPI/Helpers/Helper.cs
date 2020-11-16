using System;
using MafiaGameAPI.Enums;

namespace MafiaGameAPI.Helpers
{
    public static class Helper
    {
        public static string GenerateGroupName(String roomId, ChatTypeEnum chatType)
        {
            return roomId + "" + chatType.ToString("g");
        }

        public static string GenerateGroupName(String roomId)
        {
            return roomId + "GameGroup";
        }
    }
}