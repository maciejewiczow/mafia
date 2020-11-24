using System;
using System.Linq;
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
        private readonly IGameRepository _gameRepository;

        public ChatService(IChatRepository chatRepository, IGameRepository gameRepository)
        {
            _chatRepository = chatRepository;
            _gameRepository = gameRepository;
        }

        public async Task<List<Message>> GetMessages(String groupName)
        {
            return await _chatRepository.GetMessages(groupName);
        }

        public async Task<Message> SendMessage(String userId, String roomId, ChatTypeEnum chatType, String content)
        {
            var currentStateId = await _gameRepository.GetCurrentGameStateId(roomId);
            var currentState = await _gameRepository.GetCurrentState(roomId);
            UserState userState = currentState.UserStates.Where(u => u.UserId.Equals(userId)).First();
            
            if(
                !String.IsNullOrEmpty(currentStateId) && (
                ((userState.Role & RoleEnum.Ghost) != 0 && !chatType.Equals(ChatTypeEnum.Ghost)) ||
                ((userState.Role & RoleEnum.Mafioso) == 0 && chatType.Equals(ChatTypeEnum.Mafia) && !currentState.Phase.Equals(PhaseEnum.Night)) || 
                ((userState.Role & RoleEnum.Ghost) == 0 && !currentState.Phase.Equals(PhaseEnum.Day)) ||
                (userState == null)) ||
                String.IsNullOrEmpty(currentStateId) && !chatType.Equals(ChatTypeEnum.General))
            {
                throw new Exception("Message not allowed!");
            }

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
