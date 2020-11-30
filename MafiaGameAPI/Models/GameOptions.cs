using System;

namespace MafiaGameAPI.Models
{
    public class GameOptions
    {
        public int MaxPlayers { get; set; }
        public TimeSpan PhaseDuration { get; set; }
        public int MafiosoCount { get; set; }
        public bool IsPublic { get; set; }
        public bool AreVotesVisible { get; set; }

        public GameOptions()
        {
            MaxPlayers = 10;
            PhaseDuration = new TimeSpan(0, 0, 20);
            MafiosoCount = 1;
            IsPublic = true;
            AreVotesVisible = true;
        }
    }
}
