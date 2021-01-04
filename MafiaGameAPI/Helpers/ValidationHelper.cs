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
            var ownerId = await _gameRoomsRepository.GetRoomOwner(roomId);

            if (userId.Equals(ownerId)) return true;
            else return false;
        }

        public async Task<bool> IsMessageValid(string userId, GameRoom room, ChatTypeEnum chatType, string content)
        {
            if (content.Length > 50) return false;

            return await room.CurrentGameState.CanSendMessage(userId, chatType);
        }

        public async Task<bool> IsVoteValid(string userId, GameRoom room, string votedUserId)
        {
            return await room.CurrentGameState.IsVoteValid(userId, votedUserId);
        }
    }
}
