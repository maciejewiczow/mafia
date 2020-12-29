using System;
using MafiaGameAPI.Models;

namespace MafiaGameAPI.Helpers
{
    public class GameOptionsBuilder : IGameOptionsBuilder
    {
        private GameOptions _gameOptions;

        public GameOptionsBuilder()
        {
            _gameOptions = new GameOptions();
        }

        public IGameOptionsBuilder WithDefaultOptions()
        {
            _gameOptions.MaxPlayers = 10;
            _gameOptions.PhaseDuration = new TimeSpan(0, 10, 0);
            _gameOptions.MafiosoCount = 1;
            _gameOptions.IsPublic = true;
            _gameOptions.AreVotesVisible = true;
            return this;
        }

        public IGameOptionsBuilder SetMaxPlayers(int maxPlayers)
        {
            if (maxPlayers < 3) throw new Exception("Too few players");
            _gameOptions.MaxPlayers = maxPlayers;
            return this;
        }

        public IGameOptionsBuilder SetPhaseDuration(int minutes)
        {
            if (minutes < 1) throw new Exception("Too few minutes");
            if (minutes > 60) throw new Exception("Too many minutes");
            _gameOptions.PhaseDuration = new TimeSpan(0, minutes, 0);
            return this;
        }

        public IGameOptionsBuilder SetMafiosoCount(int mafiosoCount)
        {
            if (mafiosoCount < 1) throw new Exception("Too few mafiosos");
            if (mafiosoCount > _gameOptions.MaxPlayers / 2) throw new Exception("Too many mafiosos");
            _gameOptions.MafiosoCount = mafiosoCount;
            return this;
        }

        public IGameOptionsBuilder SetIsPublic(bool isPublic)
        {
            _gameOptions.IsPublic = isPublic;
            return this;
        }

        public IGameOptionsBuilder SetAreVotesVisible(bool areVotesVisible)
        {
            _gameOptions.AreVotesVisible = areVotesVisible;
            return this;
        }

        public GameOptions Build()
        {
            return _gameOptions;
        }
    }
}
