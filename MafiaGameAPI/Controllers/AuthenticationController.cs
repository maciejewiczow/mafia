using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MafiaGameAPI.Models;
using MafiaGameAPI.Services;
using MafiaGameAPI.Models.DTO.Responses;
using Microsoft.AspNetCore.Authorization;
using MafiaGameAPI.Enums;
using System.ComponentModel.DataAnnotations;
using MafiaGameAPI.Models.DTO;

namespace MafiaGameAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        IAuthenticationService _authService;

        public AuthenticationController(IAuthenticationService service)
        {
            _authService = service;
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
