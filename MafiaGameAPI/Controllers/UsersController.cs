using System.Threading.Tasks;
using MafiaGameAPI.Models;
using MafiaGameAPI.Repositories;
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

        public UsersController(IUsersRepository repo)
        {
            _users = repo;
        }

        [HttpGet("current")]
        public async Task<User> getCurrentUser()
        {
            var user = await _users.GetUserById(User.Identity.Name);
            return user;
        }
    }
}
