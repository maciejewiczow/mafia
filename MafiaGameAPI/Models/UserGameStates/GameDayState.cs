using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MafiaGameAPI.Enums;
using MafiaGameAPI.Helpers;

namespace MafiaGameAPI.Models.UserGameStates
{
    public class GameDayState : GameState
    {
        public GameDayState(GameRoom room)
        {
            Context = room;
        }

        //Dodałem taki konstruktor, żeby mogo nie mia problemu z tworzeniem instancji
        public GameDayState()
        {
        }

        public override bool CanSendMessage(string userId, ChatTypeEnum chatType)
        {
            UserState userState = UserStates.Where(u => u.UserId.Equals(userId)).First();
            if (!IsUserInRoom(userId)) return false;
            if (chatType.Equals(ChatTypeEnum.Citizen) && (userState.Role & RoleEnum.Ghost) == 0) return true;
            if (chatType.Equals(ChatTypeEnum.Ghost) && (userState.Role & RoleEnum.Ghost) != 0) return true;
            //mafia nie moze pisac ze soba w dzien
            return false;
        }

        public override void ChangePhase()
        {
            if (VoteState.Count != 0)
            {
                var votedUserId = VoteState
                                .GroupBy(i => i.VotedUserId)
                                .OrderByDescending(grp => grp.Count())
                                .Select(grp => grp.Key).First();
                UserStates.Find(u => u.UserId.Equals(votedUserId)).Role |= RoleEnum.Ghost;
            }

            var votingStartDate = DateTime.Now;
            GameState newState;
            if (HasGameEnded())
            {
                newState = new GameEndedState()
                {
                    Id = IdentifiersHelper.CreateGuidString(),
                    UserStates = UserStates,
                    VoteState = new List<VoteState>(),
                    VotingStart = votingStartDate,
                    VotingEnd = votingStartDate.Add(Context.GameOptions.PhaseDuration)
                };
            }
            else
            {
                newState = new GameNightState()
                {
                    Id = IdentifiersHelper.CreateGuidString(),
                    UserStates = UserStates,
                    VoteState = new List<VoteState>(),
                    VotingStart = votingStartDate,
                    VotingEnd = votingStartDate.Add(Context.GameOptions.PhaseDuration)
                };
            }
            Context.CurrentGameState = newState;
        }

        public override IList<ChatTypeEnum> GetUserChatGroups(string userId)
        {
            IList<ChatTypeEnum> chatGroups = new List<ChatTypeEnum>();
            if (!IsUserInRoom(userId)) return chatGroups;
            UserState userState = UserStates.Where(u => u.UserId.Equals(userId)).First();

            if ((userState.Role & RoleEnum.Ghost) != 0) chatGroups.Add(ChatTypeEnum.Ghost);
            if ((userState.Role & RoleEnum.Mafioso) != 0) chatGroups.Add(ChatTypeEnum.Mafia);
            chatGroups.Add(ChatTypeEnum.Citizen);

            return chatGroups;
        }

        public override bool IsVoteValid(string votingUserId, string votedUserId)
        {
            if (!IsUserInRoom(votingUserId) || !IsUserInRoom(votedUserId)) return false;

            UserState votedUserState = UserStates.Where(u => u.UserId.Equals(votedUserId)).First();
            UserState votingUserState = UserStates.Where(u => u.UserId.Equals(votingUserId)).First();

            if (((votingUserState.Role & RoleEnum.Ghost) != 0) ||
                ((votedUserState.Role & RoleEnum.Ghost) != 0))
            {
                return false;
            }
            else
            {
                return true;
            }
        }

        public override bool HasVotingFinished()
        {
            int votesCount = VoteState.Count;
            int requiredVoteCount = UserStates.Count(u => (u.Role & RoleEnum.Ghost) == 0);
            return votesCount >= requiredVoteCount;
        }

        private bool HasGameEnded()
        {
            int mafiosoCount = UserStates.Count(u => (u.Role & RoleEnum.Mafioso) != 0 && (u.Role & RoleEnum.Ghost) == 0);
            int citizenCount = UserStates.Count(u => (u.Role & RoleEnum.Citizen) != 0 && (u.Role & RoleEnum.Ghost) == 0);

            if (mafiosoCount == citizenCount)
            {
                return true;
            }

            if (mafiosoCount == 0)
            {
                return true;
            }

            return false;
        }

        private bool IsUserInRoom(string userId)
        {
            return this.Context.Participants.Contains(userId);
        }
    }
}
