using System.Threading.Tasks;
using MafiaGameAPI.Enums;
using MafiaGameAPI.Models;
using MafiaGameAPI.Repositories;

namespace MafiaGameAPI.Helpers
{
    public class ValidationHelper : IValidationHelper
    {
        private readonly IGameRoomsRepository _gameRoomsRepository;
        private readonly IGameRepository _gameRepository;

        public ValidationHelper(IGameRoomsRepository gameRoomsRepository, IGameRepository gameRepository)
        {
            _gameRoomsRepository = gameRoomsRepository;
            _gameRepository = gameRepository;
        }

        public async Task<bool> IsUserAutorizedToStartGame(string roomId, string userId)
        {
            return userId.Equals(await _gameRoomsRepository.GetRoomOwner(roomId));
        }

        public bool IsMessageValid(string userId, GameRoom room, ChatTypeEnum chatType, string content)
        {
            if (content.Length > 50) return false;

            return room.CurrentGameState.CanSendMessage(userId, chatType);
        }

        public bool IsVoteValid(string userId, GameRoom room, string votedUserId)
        {
            return room.CurrentGameState.IsVoteValid(userId, votedUserId);
        }
    }
}
