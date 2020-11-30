using MafiaGameAPI.Models;

namespace MafiaGameAPI.Helpers
{
    public interface IOptionsBuilder
    {
        void BuildDefaultOptions();
        void SetMaxPlayers (int maxPlayers);
        void SetPhaseDuration (int minutes);
        void SetMafiosoCount(int mafiosoCount);
        void SetIsPublic(bool isPublic);
        void SetAreVotesVisible(bool areVotesVisible);
        void BuildNewOptions();
        GameOptions GetResult();
    }
}