using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using MafiaGameAPI.Enums;
using MafiaGameAPI.Models;
using MafiaGameAPI.Repositories;
using MafiaGameAPI.Helpers;
using Microsoft.AspNetCore.SignalR;

namespace MafiaGameAPI.Services
{
    public class ChatService : IChatService
    {
        private readonly IChatRepository _chatRepository;
        private readonly IGameRepository _gameRepository;
        private readonly IValidationHelper _validationHelper;

        public ChatService(IChatRepository chatRepository, IGameRepository gameRepository, IValidationHelper validationHelper)
        {
            _chatRepository = chatRepository;
            _gameRepository = gameRepository;
            _validationHelper = validationHelper;
        }

        public async Task<List<Message>> GetMessages(String roomId, ChatTypeEnum chatType)
        {
            return await _chatRepository.GetMessages(roomId, chatType);
        }

        public async Task<List<Message>> GetMessagesForUser(String userId, String roomId)
        {
            List<Message> messages = new List<Message>();
            var currentStateId = await _gameRepository.GetCurrentGameStateId(roomId);
            if (String.IsNullOrEmpty(currentStateId))
            {
                return await _chatRepository.GetMessages(roomId, ChatTypeEnum.General);
            }


            var currentState = await _gameRepository.GetCurrentState(roomId);
            UserState userState = currentState.UserStates.Where(u => u.UserId.Equals(userId)).First();

            messages.AddRange(await _chatRepository.GetMessages(roomId, ChatTypeEnum.General));
            messages.AddRange(await _chatRepository.GetMessages(roomId, ChatTypeEnum.Citizen));

            if ((userState.Role & RoleEnum.Ghost) != 0)
            {
                messages.AddRange(await _chatRepository.GetMessages(roomId, ChatTypeEnum.Ghost));
            }

            if ((userState.Role & RoleEnum.Mafioso) != 0)
            {
                messages.AddRange(await _chatRepository.GetMessages(roomId, ChatTypeEnum.Mafia));
            }

            return messages;
        }

        public async Task<Message> SendMessage(String userId, String roomId, ChatTypeEnum chatType, String content)
        {
            if(!await _validationHelper.IsMessageValid(userId, roomId, chatType, content))
            {
                throw new HubException("Message not allowed!");
            }

            Message message = new Message()
            {
                UserId = userId,
                SentAt = DateTime.Now,
                Content = content,
                RoomId = roomId,
                ChatType = chatType
            };
            await _chatRepository.SendMessage(message);
            return message;
        }
    }
}
