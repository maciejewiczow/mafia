using System;
using System.Threading.Tasks;
using MafiaGameAPI.Models;
using MafiaGameAPI.Models.DTO;

namespace MafiaGameAPI.Repositories
{
    public interface IUsersRepository
    {
        Task<UserProjection> GetUserProjectionById(String userId);
        Task<User> GetUserById(String userId);
        Task<User> CreateUser(CreateUserDTO dto);
        Task<String> GetRoomId(string userId);
    }
}
