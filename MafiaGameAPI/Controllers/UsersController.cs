using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using MafiaGameAPI.Enums;
using MafiaGameAPI.Models;
using MafiaGameAPI.Models.DTO;
using MafiaGameAPI.Models.DTO.Responses;
using MafiaGameAPI.Repositories;
using MafiaGameAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MafiaGameAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUsersRepository _users;
        private readonly IAuthenticationService _authService;

        public UsersController(IUsersRepository usersRepository, IAuthenticationService authService)
        {
            _users = usersRepository;
            _authService = authService;
        }

        [HttpGet("current")]
        public async Task<User> getCurrentUser()
        {
            var user = await _users.GetUserById(User.Identity.Name);
            return user;
        }

        [Authorize(Policy = nameof(TokenType.RefreshToken))]
        [HttpGet("tokenRefresh")]
        public ActionResult<TokenResponse> TokenRefresh()
        {
            return _authService.CreateNewAccessToken(User.Identity.Name);
        }

        [AllowAnonymous]
        [HttpPost("createUser")]
        public async Task<ActionResult<NewUserTokenResponse>> CreateUser([Required, FromBody] CreateUserDTO dto)
        {
            return await _authService.CreateUserAndGenerateTokensAsync(dto);
        }
    }
}
