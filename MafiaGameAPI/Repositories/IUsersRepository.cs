using System;
using System.Threading.Tasks;
using MafiaGameAPI.Models;
using MafiaGameAPI.Models.DTO;

namespace MafiaGameAPI.Repositories
{
    public interface IUsersRepository
    {
        Task<User> GetUserById(String userId);
        Task<User> CreateUser(CreateUserDTO dto);
    }
}
