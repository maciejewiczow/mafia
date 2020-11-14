using System;

namespace MafiaGameAPI.Models.DTO.Responses
{
    public class TokenResponse
    {
        public String Token { get; set; }
        public String ExpiresOn { get; set; }
    }
}
