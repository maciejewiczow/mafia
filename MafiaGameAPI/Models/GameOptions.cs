using System;

namespace MafiaGameAPI.Models
{
    public class GameOptions
    {
        public int MaxPlayers { get; set; }
        public TimeSpan PhaseTime { get; set; }
        public int MafiosoCount { get; set; }
        public bool IsPublic { get; set; }
        public bool VisibleVotes { get; set; }

        public GameOptions()
        {
            MaxPlayers = 10;
            PhaseTime = new TimeSpan(0, 10, 0);
            MafiosoCount = 3;
            IsPublic = true;
            VisibleVotes = true;
        }

    }

}
