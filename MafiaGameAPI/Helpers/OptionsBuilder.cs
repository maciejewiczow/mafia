using System;
using MafiaGameAPI.Models;

namespace MafiaGameAPI.Helpers
{
    public class OptionsBuilder : IOptionsBuilder
    {
        private GameOptions _gameOptions = new GameOptions();
        public void BuildDefaultOptions()
        {
            _gameOptions.MaxPlayers = 10;
            _gameOptions.PhaseDuration = new TimeSpan(0, 10, 0);
            _gameOptions.MafiosoCount = 3;
            _gameOptions.IsPublic = true;
            _gameOptions.AreVotesVisible = true;
        }

        public void SetMaxPlayers(int maxPlayers)
        {
            if (maxPlayers < 3) throw new Exception("Too few players");
            _gameOptions.MaxPlayers = maxPlayers;
        }

        public void SetPhaseDuration(int minutes)
        {
            if (minutes < 1) throw new Exception("Too few minutes");
            if (minutes > 60) throw new Exception("Too many minutes");
            _gameOptions.PhaseDuration = new TimeSpan(0, minutes, 0);
        }

        public void SetMafiosoCount(int mafiosoCount)
        {
            if (mafiosoCount < 1) throw new Exception("Too few mafiosos");
            if (mafiosoCount > _gameOptions.MaxPlayers / 2) throw new Exception("Too many mafiosos");
            _gameOptions.MafiosoCount = mafiosoCount;
        }

        public void SetIsPublic(bool isPublic)
        {
            _gameOptions.IsPublic = isPublic;
        }

        public void SetAreVotesVisible(bool areVotesVisible)
        {
            _gameOptions.AreVotesVisible = areVotesVisible;
        }

        public GameOptions GetResult()
        {
            return _gameOptions;
        }

        public void BuildNewOptions()
        {
            _gameOptions = new GameOptions();
        }
    }
}
