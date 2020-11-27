using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using MafiaGameAPI.Enums;
using MafiaGameAPI.Models.DTO;
using MafiaGameAPI.Models.DTO.Responses;
using MafiaGameAPI.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace MafiaGameAPI.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly IUsersRepository _users;
        private readonly IConfiguration _configuration;

        public AuthenticationService(IUsersRepository repo, IConfiguration config)
        {
            _users = repo;
            _configuration = config;
        }

        public async Task<NewUserTokenResponse> CreateUserAndGenerateTokensAsync(CreateUserDTO userName)
        {
            var user = await _users.CreateUser(userName);

            var accessTokenConfig = _configuration.GetSection("AccessToken");
            var refreshTokenConfig = _configuration.GetSection("RefreshToken");

            var accessToken = generateToken(
                accessTokenConfig["Signature"],
                accessTokenConfig["LifeSpan"],
                user.Id.ToString(),
                TokenType.AccessToken
            );

            var refreshToken = generateToken(
                refreshTokenConfig["Signature"],
                refreshTokenConfig["LifeSpan"],
                user.Id.ToString(),
                TokenType.RefreshToken
            );

            return new NewUserTokenResponse()
            {
                Token = accessToken,
                RefreshToken = refreshToken,
                ExpiresOn = DateTime.UtcNow.Add(TimeSpan.Parse(accessTokenConfig["LifeSpan"])).ToString("O")
            };
        }

        public TokenResponse CreateNewAccessToken(String userId)
        {
            var accessTokenConfig = _configuration.GetSection("AccessToken");

            var accessToken = generateToken(
                accessTokenConfig["Signature"],
                accessTokenConfig["LifeSpan"],
                userId,
                TokenType.AccessToken
            );

            return new TokenResponse()
            {
                Token = accessToken,
                ExpiresOn = DateTime.UtcNow.Add(TimeSpan.Parse(accessTokenConfig["LifeSpan"])).ToString("O")
            };
        }

        private String generateToken(String keyString, String ttl, String userId, TokenType type)
        {
            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(keyString));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(JwtRegisteredClaimNames.UniqueName, userId),
                    new Claim("type", type.ToString())
                }),
                SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature)
            };

            if (ttl != null)
            {
                tokenDescriptor.IssuedAt = DateTime.UtcNow;
                tokenDescriptor.Expires = DateTime.UtcNow.Add(TimeSpan.Parse(ttl));
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
