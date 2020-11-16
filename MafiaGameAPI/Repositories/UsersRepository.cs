using System;
using System.Threading.Tasks;
using MafiaGameAPI.Models;
using MafiaGameAPI.Models.DTO;
using MongoDB.Driver;

namespace MafiaGameAPI.Repositories
{
    public class UsersRepository : IUsersRepository
    {
        private readonly IMongoCollection<User> _usersCollection;

        public UsersRepository(IMongoClient mongoClient)
        {
            _usersCollection = mongoClient.GetDatabase("mafia").GetCollection<User>("users");
        }

        public async Task<User> CreateUser(CreateUserDTO dto)
        {
            var user = new User()
            {
                Name = dto.UserName
            };

            await _usersCollection.InsertOneAsync(user);

            return user;
        }

        public async Task<User> GetUserById(String userId)
        {
            return await _usersCollection
                .Find(Builders<User>.Filter.Eq("_id", userId))
                .FirstOrDefaultAsync();
        }
        public async Task<String> GetRoomId(string userId)
        {
            var user = await _usersCollection
                .Find(Builders<User>.Filter.Eq("_id", userId))
                .FirstOrDefaultAsync();
                
            return user.RoomId;
        }
    }
}
