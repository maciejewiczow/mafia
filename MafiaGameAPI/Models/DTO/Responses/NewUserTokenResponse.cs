using System;

namespace MafiaGameAPI.Models.DTO.Responses
{
    public class NewUserTokenResponse
    {
        public String Token { get; set; }
        public String RefreshToken { get; set; }
        public String ExpiresOn { get; set; }
    }
}
