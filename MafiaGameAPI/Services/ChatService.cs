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

        public async Task<List<Message>> GetMessagesByUserId(String userId, String roomId)
        {
            List<Message> messages = new List<Message>();
            var currentStateId = await _gameRepository.GetCurrentGameStateId(roomId);
            if(String.IsNullOrEmpty(currentStateId))
            {
                messages = await _chatRepository.GetMessages(IdentifiersHelper.GenerateChatGroupName(roomId, ChatTypeEnum.General));
            }
            else
            {
                var currentState = await _gameRepository.GetCurrentState(roomId);
                UserState userState = currentState.UserStates.Where(u => u.UserId.Equals(userId)).First();

                var generalMessages = await _chatRepository.GetMessages(IdentifiersHelper.GenerateChatGroupName(roomId, ChatTypeEnum.General));
                foreach (Message m in generalMessages)
                {
                    messages.Add(m);
                }
                var citizenMessages = await _chatRepository.GetMessages(IdentifiersHelper.GenerateChatGroupName(roomId, ChatTypeEnum.Citizen));
                foreach (Message m in citizenMessages)
                {
                    messages.Add(m);
                }
                if((userState.Role & RoleEnum.Ghost) == 0)
                {
                    var ghostMessages = await _chatRepository.GetMessages(IdentifiersHelper.GenerateChatGroupName(roomId, ChatTypeEnum.Ghost));
                    foreach (Message m in ghostMessages)
                    {
                        messages.Add(m);
                    }
                }
                if((userState.Role & RoleEnum.Mafioso) == 0)
                {
                    var mafiaMessages = await _chatRepository.GetMessages(IdentifiersHelper.GenerateChatGroupName(roomId, ChatTypeEnum.Mafia));
                    foreach (Message m in mafiaMessages)
                    {
                        messages.Add(m);
                    }
                }
            }
            return messages;
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
