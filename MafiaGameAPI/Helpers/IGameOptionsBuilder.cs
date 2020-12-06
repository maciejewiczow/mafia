using MafiaGameAPI.Models;

namespace MafiaGameAPI.Helpers
{
    public interface IGameOptionsBuilder
    {
        IGameOptionsBuilder WithDefaultOptions();
        IGameOptionsBuilder SetMaxPlayers(int maxPlayers);
        IGameOptionsBuilder SetPhaseDuration(int minutes);
        IGameOptionsBuilder SetMafiosoCount(int mafiosoCount);
        IGameOptionsBuilder SetIsPublic(bool isPublic);
        IGameOptionsBuilder SetAreVotesVisible(bool areVotesVisible);
        GameOptions Build();
    }
}
