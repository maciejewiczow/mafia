using System;

namespace MafiaGameAPI.Models
{
    public class GameOptions
    {
        public int MaxPlayers { get; set; } = 10;
        public TimeSpan PhaseDuration { get; set; } = new TimeSpan(0, 10, 0);
        public int MafiosoCount { get; set; } = 1;
        public bool IsPublic { get; set; } = true;
        public bool AreVotesVisible { get; set; } = true;
    }
}
