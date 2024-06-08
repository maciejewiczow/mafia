using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using MafiaGameAPI.Enums;
using MafiaGameAPI.Helpers;
using MafiaGameAPI.Hubs;
using MafiaGameAPI.Models;
using MafiaGameAPI.Models.UserGameStates;
using MafiaGameAPI.Repositories;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;

namespace MafiaGameAPI.Services
{
    public class GameService : IGameService
    {
        private readonly IGameRepository _gameRepository;
        private readonly IGameRoomsRepository _gameRoomsRepository;
        private readonly IHubContext<GameChatHub, IGameChatClient> _context;
        private readonly IValidationHelper _validationHelper;
        private readonly IAuthenticationService authenticationService;
        private readonly IHttpClientFactory clientFactory;
        private readonly IConfiguration configuration;

        public GameService(
            IGameRepository gameRepository,
            IGameRoomsRepository gameRoomsRepository,
            IHubContext<GameChatHub, IGameChatClient> context,
            IValidationHelper validationHelper,
            IAuthenticationService authService,
            IHttpClientFactory factory,
            IConfiguration config
        )
        {
            _gameRepository = gameRepository;
            _gameRoomsRepository = gameRoomsRepository;
            _context = context;
            _validationHelper = validationHelper;
            authenticationService = authService;
            clientFactory = factory;
            configuration = config;
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

        public async Task<GameState> StartGame(String roomId, String userId)
        {
            if (!await _validationHelper.IsUserAutorizedToStartGame(roomId, userId))
            {
                throw new HubException("User not authorized to start game!");
            }

            var room = await _gameRoomsRepository.GetRoomById(roomId);

            room.CurrentGameState.ChangePhase();
            await _gameRepository.ChangePhase(roomId, room.CurrentGameState);
            await RunPhase(roomId, room.GameOptions.PhaseDuration, room.CurrentGameState.Id);

            return room.CurrentGameState;
        }

        private async Task ChangePhase(String roomId, GameState newState)
        {
            GameOptions options = _gameRoomsRepository.GetOptionsByRoomId(roomId);
            await _gameRepository.ChangePhase(roomId, newState);

            if (!await HasGameEnded(roomId))
            {
                await _context.Clients.Group(IdentifiersHelper.GenerateRoomGroupName(roomId)).UpdateGameStateAsync(newState);

                await RunPhase(roomId, options.PhaseDuration, newState.Id);
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

        private async Task<GameState> VotingAction(String roomId)
        {
            GameRoom room = await _gameRoomsRepository.GetRoomById(roomId);
            if (room.CurrentGameState.VoteState.Count != 0)
            {
                var votedUserId = room.CurrentGameState.VoteState
                                .GroupBy(i => i.VotedUserId)
                                .OrderByDescending(grp => grp.Count())
                                .Select(grp => grp.Key).First();

                await _context.Clients.Group(IdentifiersHelper.GenerateRoomGroupName(roomId)).UpdateVotingResultAsync(votedUserId);

                room.CurrentGameState.UserStates.Find(u => u.UserId.Equals(votedUserId)).Role |= RoleEnum.Ghost;

                // Add voted user to ghost chat group
                await _context.Clients.User(votedUserId).CallAddToGhostGroup();
            }
            room.CurrentGameState.ChangePhase();
            await ChangePhase(roomId, room.CurrentGameState);

            return room.CurrentGameState;
        }

        private async Task RunPhase(String roomId, TimeSpan phaseDuration, String stateId)
        {
            using var client = clientFactory.CreateClient("TurnFunction");

            var token = authenticationService.GenerateCallbackToken(roomId, stateId);

            using var jsonContent = new StringContent(
                JsonSerializer.Serialize(new
                {
                    callbackToken = token,
                    callbackUrl = configuration.GetValue<String>("TurnFunction:CallbackUrl"),
                    turnEnd = DateTime.Now + phaseDuration,
                }),
                Encoding.UTF8,
                "application/json"
            );

            await client.PostAsync("/api/start-turn-timer", jsonContent);
        }

        public async Task ChangeTurn(String roomId, String stateId)
        {
            GameRoom room = await _gameRoomsRepository.GetRoomById(roomId);

            if (stateId.Equals(room.CurrentGameState.Id) && !await HasGameEnded(roomId))
            {
                await VotingAction(roomId);
            }
        }
    }
}
