using System;
using System.Threading.Tasks;
using MafiaGameAPI.Models.DTO;
using MafiaGameAPI.Models.DTO.Responses;

namespace MafiaGameAPI.Services
{
    public interface IAuthenticationService
    {
        Task<NewUserTokenResponse> CreateUserAndGenerateTokensAsync(CreateUserDTO dto);
        TokenResponse CreateNewAccessToken(String userId);
        String GenerateCallbackToken(String roomId, String stateId);
    }
}
