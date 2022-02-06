using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MafiaGameAPI.Enums;
using MafiaGameAPI.Helpers;
using MafiaGameAPI.Hubs;
using MafiaGameAPI.Models;
using MafiaGameAPI.Models.UserGameStates;
using MafiaGameAPI.Repositories;
using Microsoft.AspNetCore.SignalR;

namespace MafiaGameAPI.Services
{
    public class GameService : IGameService
    {
        private readonly IGameRepository _gameRepository;
        private readonly IGameRoomsRepository _gameRoomsRepository;
        private readonly IHubContext<GameHub, IGameClient> _context;
        private readonly IValidationHelper _validationHelper;

        public GameService(
            IGameRepository gameRepository,
            IGameRoomsRepository gameRoomsRepository,
            IHubContext<GameHub, IGameClient> context,
            IValidationHelper validationHelper
        )
        {
            _gameRepository = gameRepository;
            _gameRoomsRepository = gameRoomsRepository;
            _context = context;
            _validationHelper = validationHelper;
        }

        private async Task<bool> HasGameEnded(String roomId)
        {
            var room = await _gameRoomsRepository.GetRoomById(roomId);
            var currentState = room.CurrentGameState;
            int mafiosoCount = currentState.UserStates.Count(u => u.Role.HasFlag(RoleEnum.Mafioso) && !u.Role.HasFlag(RoleEnum.Ghost));
            int citizenCount = currentState.UserStates.Count(u => u.Role.HasFlag(RoleEnum.Citizen) && !u.Role.HasFlag(RoleEnum.Ghost));

            var groupName = IdentifiersHelper.GenerateRoomGroupName(roomId);

            if (mafiosoCount == citizenCount)
            {
                currentState.ChangePhase();
                await _gameRepository.ChangePhase(roomId, currentState);
                await _context.Clients.Group(groupName).GameEndedAsync(RoleEnum.Mafioso.ToString());
                return true;
            }

            if (mafiosoCount == 0)
            {
                currentState.ChangePhase();
                await _gameRepository.ChangePhase(roomId, currentState);
                await _context.Clients.Group(groupName).GameEndedAsync(RoleEnum.Citizen.ToString());
                return true;
            }

            return false;
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
                throw new HubException("Too few citizens to start the game");
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

        public async Task<GameState> StartGame(String roomId, String userId)
        {
            if (!await _validationHelper.IsUserAutorizedToStartGame(roomId, userId))
            {
                throw new HubException("User not authorized to start game!");
            }
            var room = await _gameRoomsRepository.GetRoomById(roomId);
            var votingStartDate = DateTime.Now;
            GameState state = new GameNightState(room)
            {
                Id = IdentifiersHelper.CreateGuidString(),
                UserStates = await AssignPlayersToRoles(roomId),
                VoteState = new List<VoteState>(),
                VotingStart = votingStartDate,
                VotingEnd = votingStartDate.Add(room.GameOptions.PhaseDuration)
            };

            // FIXME: jak będzie wyjątek to sie wszystko popsuje
            _ = Task.Run(() => RunPhase(roomId, room.GameOptions.PhaseDuration, state.Id));

            state.ChangePhase();
            await _gameRepository.ChangePhase(roomId, state);

            return state;
        }

        public async Task ChangePhase(String roomId, GameState newState)
        {
            GameOptions options = _gameRoomsRepository.GetOptionsByRoomId(roomId);
            await _gameRepository.ChangePhase(roomId, newState);

            if (!(await HasGameEnded(roomId)))
            {
                await _context.Clients.Group(IdentifiersHelper.GenerateRoomGroupName(roomId)).UpdateGameStateAsync(newState);

                // FIXME: jak będzie wyjątek to sie wszystko popsuje
                _ = Task.Run(() => RunPhase(roomId, options.PhaseDuration, newState.Id));
            }
        }

        public async Task<VoteState> Vote(String roomId, String userId, String votedUserId)
        {
            var room = await _gameRoomsRepository.GetRoomById(roomId);
            if (!_validationHelper.IsVoteValid(userId, room, votedUserId))
            {
                throw new HubException("Not allowed voting!");
            }

            var vote = new VoteState()
            {
                UserId = userId,
                VotedUserId = votedUserId
            };
            var voteState = await _gameRepository.Vote(roomId, vote);
            await _context.Clients.Group(IdentifiersHelper.GenerateRoomGroupName(roomId)).NewVoteAsync(voteState);

            var updatedRoom = await _gameRoomsRepository.GetRoomById(roomId);
            if (updatedRoom.CurrentGameState.HasVotingFinished())
            {
                await VotingAction(roomId);
            }

            return voteState;
        }

        public async Task<GameState> VotingAction(String roomId)
        {
            GameRoom room = await _gameRoomsRepository.GetRoomById(roomId);
            if (room.CurrentGameState.VoteState.Count != 0)
            {
                var votedUserId = room.CurrentGameState.VoteState
                                .GroupBy(i => i.VotedUserId)
                                .OrderByDescending(grp => grp.Count())
                                .Select(grp => grp.Key).First();

                await _context.Clients.Group(IdentifiersHelper.GenerateRoomGroupName(roomId)).UpdateVotingResultAsync(votedUserId);
            }
            room.CurrentGameState.ChangePhase();
            await ChangePhase(roomId, room.CurrentGameState);

            return room.CurrentGameState;
        }

        public async Task<GameState> GetCurrentState(String roomId)
        {
            return await _gameRepository.GetCurrentState(roomId);
        }

        private async Task RunPhase(String roomId, TimeSpan timeSpan, String stateId)
        {
            Thread.Sleep(timeSpan);

            GameRoom room = await _gameRoomsRepository.GetRoomById(roomId);

            if (stateId.Equals(room.CurrentGameState.Id))
            {
                await VotingAction(roomId);
            }
        }
    }
}
