using System.Linq;
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

        public async Task<bool> IsMessageValid(string userId, string roomId, ChatTypeEnum chatType, string content)
        {
            if (content.Length > 50) return false;

            if (!await _gameRoomsRepository.IsUserInRoom(userId, roomId)) return false;

            if (chatType.Equals(ChatTypeEnum.General))
            {
                if (!await _gameRoomsRepository.HasGameStarted(roomId)) return true;
                else return false;
            }
            //TODO:Dodać wzorzec projektowy
            var currentState = await _gameRepository.GetCurrentState(roomId);
            UserState userState = currentState.UserStates.Where(u => u.UserId.Equals(userId)).First();

            if ((userState.Role & RoleEnum.Ghost) != 0
                && (chatType.Equals(ChatTypeEnum.Ghost))) return true;

            if (chatType.Equals(ChatTypeEnum.Citizen)
                && (userState.Role & RoleEnum.Ghost) == 0
                && currentState.Phase.Equals(PhaseEnum.Day)) return true;

            if (chatType.Equals(ChatTypeEnum.Mafia)
                && (userState.Role & RoleEnum.Ghost) == 0
                && (userState.Role & RoleEnum.Mafioso) != 0
                && currentState.Phase.Equals(PhaseEnum.Night)) return true;

            return false;
        }

        public async Task<bool> IsVoteValid(string roomId, string userId, string votedUserId)
        {
            if (!await _gameRoomsRepository.HasGameStarted(roomId)
                || !await _gameRoomsRepository.IsUserInRoom(userId, roomId)) return false;
            //TODO:Dodać wzorzec projektowy
            //var currentState = await _gameRepository.GetCurrentState(roomId);
            //UserState votedUserState = currentState.UserStates.Where(u => u.UserId.Equals(votedUserId)).First();
            //UserState userState = currentState.UserStates.Where(u => u.UserId.Equals(userId)).First();
            //
            //if (((userState.Role & RoleEnum.Ghost) != 0)
            //    || ((votedUserState.Role & RoleEnum.Ghost) != 0)
            //    || (userState == null)
            //    || (votedUserId == null)
            //    || ((votedUserState.Role & RoleEnum.Mafioso) == 0 && currentState.Phase.Equals(PhaseEnum.Night)))
            //{
            //    return false;
            //}
            return true;
        }
    }
}
