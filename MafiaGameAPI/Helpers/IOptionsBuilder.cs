using MafiaGameAPI.Models;

namespace MafiaGameAPI.Helpers
{
    public interface IOptionsBuilder
    {
        IOptionsBuilder BuildDefaultOptions();
        IOptionsBuilder SetMaxPlayers (int maxPlayers);
        IOptionsBuilder SetPhaseDuration (int minutes);
        IOptionsBuilder SetMafiosoCount(int mafiosoCount);
        IOptionsBuilder SetIsPublic(bool isPublic);
        IOptionsBuilder SetAreVotesVisible(bool areVotesVisible);
        IOptionsBuilder NewOptions();
        GameOptions Build();
    }
}