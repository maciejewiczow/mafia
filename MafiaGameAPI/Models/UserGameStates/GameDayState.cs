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
        public GameDayState(GameRoom room): base()
        {
            Context = room;
        }

        //Dodałem taki konstruktor, żeby mongo nie miało problemu z tworzeniem instancji
        public GameDayState(): base()
        { }

        public override bool CanSendMessage(string userId, ChatTypeEnum chatType)
        {
            UserState userState = UserStates.Where(u => u.UserId.Equals(userId)).First();
            if (!IsUserInRoom(userId)) return false;
            if (chatType.Equals(ChatTypeEnum.Citizen) && !userState.Role.HasFlag(RoleEnum.Ghost)) return true;
            if (chatType.Equals(ChatTypeEnum.Ghost) && userState.Role.HasFlag(RoleEnum.Ghost)) return true;
            //mafia nie moze pisac ze soba w dzien
            return false;
        }

        public override void ChangePhase()
        {
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

            if (userState.Role.HasFlag(RoleEnum.Ghost)) chatGroups.Add(ChatTypeEnum.Ghost);
            if (userState.Role.HasFlag(RoleEnum.Mafioso)) chatGroups.Add(ChatTypeEnum.Mafia);
            chatGroups.Add(ChatTypeEnum.Citizen);

            return chatGroups;
        }

        public override bool IsVoteValid(string votingUserId, string votedUserId)
        {
            if (!IsUserInRoom(votingUserId) || !IsUserInRoom(votedUserId)) return false;

            UserState votedUserState = UserStates.Where(u => u.UserId.Equals(votedUserId)).First();
            UserState votingUserState = UserStates.Where(u => u.UserId.Equals(votingUserId)).First();

            return !votingUserState.Role.HasFlag(RoleEnum.Ghost) &&
                !votedUserState.Role.HasFlag(RoleEnum.Ghost);
        }

        public override bool HasVotingFinished()
        {
            int votesCount = VoteState.Count;
            int requiredVoteCount = UserStates.Count(u => !u.Role.HasFlag(RoleEnum.Ghost));
            return votesCount >= requiredVoteCount;
        }

        private bool HasGameEnded()
        {
            int mafiosoCount = UserStates.Count(u => u.Role.HasFlag(RoleEnum.Mafioso) && !u.Role.HasFlag(RoleEnum.Ghost));
            int citizenCount = UserStates.Count(u => u.Role.HasFlag(RoleEnum.Citizen) && !u.Role.HasFlag(RoleEnum.Ghost));

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
