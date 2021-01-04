using System;
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
        private readonly IGameRoomsRepository _gameRoomsRepository;
        private readonly IValidationHelper _validationHelper;

        public ChatService(IChatRepository chatRepository, IGameRepository gameRepository, IGameRoomsRepository gameRoomsRepository, IValidationHelper validationHelper)
        {
            _chatRepository = chatRepository;
            _gameRepository = gameRepository;
            _validationHelper = validationHelper;
            _gameRoomsRepository = gameRoomsRepository;
        }

        public async Task<List<Message>> GetMessages(String roomId, ChatTypeEnum chatType)
        {
            return await _chatRepository.GetMessages(roomId, chatType);
        }

        public async Task<List<Message>> GetMessagesForUser(String userId, String roomId)
        {
            List<Message> messages = new List<Message>();
            var room = await _gameRoomsRepository.GetRoomById(roomId);
            var chatGroups = await room.CurrentGameState.GetUserChatGroups(userId);

            foreach (var chatGroup in chatGroups)
            {
                messages.AddRange(await _chatRepository.GetMessages(roomId, chatGroup));
            }

            return messages;
        }

        public async Task<Message> SendMessage(String userId, String roomId, ChatTypeEnum chatType, String content)
        {
            var room = await _gameRoomsRepository.GetRoomById(roomId);
            if (!await _validationHelper.IsMessageValid(userId, room, chatType, content))
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
