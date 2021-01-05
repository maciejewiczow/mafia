using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MafiaGameAPI.Enums;
using MafiaGameAPI.Helpers;
using Microsoft.AspNetCore.SignalR;

namespace MafiaGameAPI.Models.UserGameStates
{
    public class GameNotStartedState : GameState
    {
        public GameNotStartedState(GameRoom room)
        {
            Context = room;
        }

        //Dodałem taki konstruktor, żeby mogo nie mia problemu z tworzeniem instancji
        public GameNotStartedState()
        {
        }

        public override bool CanSendMessage(string userId, ChatTypeEnum chatType)
        {
            if (chatType.Equals(ChatTypeEnum.General))
                return true;
            return false;
        }

        public override void ChangePhase()
        {
            var votingStartDate = DateTime.Now;
            GameState state = new GameNightState(Context)
            {
                Id = IdentifiersHelper.CreateGuidString(),
                UserStates = AssignPlayersToRoles(),
                VoteState = new List<VoteState>(),
                VotingStart = votingStartDate,
                VotingEnd = votingStartDate.Add(Context.GameOptions.PhaseDuration)
            };
            Context.CurrentGameState = state;
        }

        public override IList<ChatTypeEnum> GetUserChatGroups(string userId)
        {
            IList<ChatTypeEnum> chatGroups = new List<ChatTypeEnum>();
            if (IsUserInRoom(userId)) chatGroups.Add(ChatTypeEnum.General);
            return chatGroups;
        }

        public override bool IsVoteValid(string votingUserId, string votedUserId)
        {
            return false;
        }

        public override bool HasVotingFinished()
        {
            return false;
        }

        private List<UserState> AssignPlayersToRoles()
        {
            List<UserState> userStates = new List<UserState>();
            GameRoom room = Context;

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

        private bool IsUserInRoom(string userId)
        {
            return this.Context.Participants.Contains(userId);
        }
    }
}
