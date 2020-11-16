using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MafiaGameAPI.Enums;
using MafiaGameAPI.Models;
using MafiaGameAPI.Repositories;

namespace MafiaGameAPI.Services
{
    public class GameService : IGameService
    {
        private readonly IGameRepository _gameRepository;
        private readonly IGameRoomsRepository _gameRoomsRepository;
        public GameService(IGameRepository gameRepository, IGameRoomsRepository gameRoomsRepository)
        {
            _gameRepository = gameRepository;
            _gameRoomsRepository = gameRoomsRepository;
        }

        private string GenerateGameStateId()
        {
            return Guid.NewGuid().ToString("D");
        }
        private async Task<bool> HasGameEnded(String roomId)
        {
            var currentState = await _gameRepository.GetCurrentState(roomId);
            int mafiosoCount = currentState.UserStates.Count(u => (u.Role & RoleEnum.Mafioso) != 0 && (u.Role & RoleEnum.Ghost) == 0);
            int citizenCount = currentState.UserStates.Count(u => (u.Role & RoleEnum.Citizen) != 0 && (u.Role & RoleEnum.Ghost) == 0);
            return mafiosoCount == citizenCount || mafiosoCount == 0;
        }
        private async Task<bool> HasVotingFinished(String roomId)
        {
            var currentState = await _gameRepository.GetCurrentState(roomId);
            int votesCount = currentState.VoteState.Count;
            int requiredVoteCount;
            if (currentState.Phase.Equals(PhaseEnum.Day))
            {
                requiredVoteCount = currentState.UserStates.Count(u => (u.Role & RoleEnum.Ghost) == 0);
            }
            else
            {
                requiredVoteCount = currentState.UserStates.Count(u => (u.Role & RoleEnum.Mafioso) != 0 && (u.Role & RoleEnum.Ghost) == 0);
            }

            return votesCount >= requiredVoteCount;

        }
        private async Task<List<UserState>> AssignPlayersToRoles(String roomId)
        {
            List<UserState> userStates = new List<UserState>();
            GameRoom room = await _gameRoomsRepository.GetRoomById(roomId);
            int mafiosoCount = room.GameOptions.MafiosoCount;
            int currentMafiosoCount = 0;
            List<String> users = room.Participants;
            Random random = new Random();
            int usersCount = users.Count;

            if (usersCount <= 2 * mafiosoCount)
            {
                throw new Exception("Too few players");
            }

            foreach (var user in users)
            {
                UserState userState = new UserState() { UserId = user };
                if (random.NextDouble() > (double)(mafiosoCount - currentMafiosoCount) / usersCount)
                {
                    userState.Role = RoleEnum.Citizen;
                }
                else
                {
                    userState.Role = RoleEnum.Mafioso;
                    currentMafiosoCount++;
                }
                userStates.Add(userState);
                usersCount--;
            }

            return userStates;
        }
        public async Task<GameState> StartGame(String roomId)
        {
            GameState state = new GameState()
            {
                Id = GenerateGameStateId(),
                UserStates = await AssignPlayersToRoles(roomId),
                Phase = PhaseEnum.Night,
                VoteState = new List<VoteState>(),
                VotingStart = DateTime.Now
            };
            return await _gameRepository.StartGame(roomId, state);
        }
        public async Task ChangePhase(String roomId, GameState newState)
        {
            GameRoom room = await _gameRoomsRepository.GetRoomById(roomId);
            var options = room.GameOptions; //Dodaj nnową metodę do pobierania samych opcji
            if (await HasGameEnded(roomId))
            {
                //jakies zakonczenie gry
            }
            else
            {
                await _gameRepository.ChangePhase(roomId, newState);
                await RunPhase(roomId, options.PhaseTime, newState.Id);
            }
        }
        public async Task<VoteState> Vote(String roomId, String userId, String votedUserId)
        {
            var vote = new VoteState()
            {
                UserId = userId,
                VotedUserId = votedUserId
            };
            var voteState = await _gameRepository.Vote(roomId, vote);

            if (await HasVotingFinished(roomId))
            {
                await VotingAction(roomId);
            }
            return voteState;

        }
        public async Task<GameState> VotingAction(String roomId)
        {
            var currentState = await _gameRepository.GetCurrentState(roomId);
            List<VoteState> voteStates = currentState.VoteState;
            var votedUserId = voteStates.GroupBy(i => i.VotedUserId).OrderByDescending(grp => grp.Count())
                  .Select(grp => grp.Key).First();
            GameState newState = new GameState()
            {
                Id = GenerateGameStateId(),
                UserStates = currentState.UserStates,
                Phase = currentState.Phase == PhaseEnum.Day ? PhaseEnum.Night : PhaseEnum.Day,
                VoteState = new List<VoteState>(),
                VotingStart = DateTime.Now
            };
            newState.UserStates.Find(u => u.UserId.Equals(votedUserId)).Role |= RoleEnum.Ghost;

            await ChangePhase(roomId, newState);
            return newState;
        }
        public async Task<GameState> GetCurrentState(String roomId)
        {
            return await _gameRepository.GetCurrentState(roomId);
        }
        private async Task RunPhase(String roomId, TimeSpan timeSpan, String stateId)
        {
            Thread.Sleep(timeSpan);
            var currentStateId = await _gameRepository.GetCurrentGameStateId(roomId);
            if (stateId.Equals(currentStateId))
            {
                await VotingAction(roomId);
            }
        }
    }
}
