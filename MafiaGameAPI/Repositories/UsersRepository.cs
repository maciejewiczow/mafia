using System;
using System.Threading.Tasks;
using MafiaGameAPI.Models;
using MafiaGameAPI.Models.DTO;
using MongoDB.Driver;
using MongoDB.Bson;

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
                .Find(Builders<User>.Filter.Eq("_id", ObjectId.Parse(userId)))
                .FirstOrDefaultAsync();
        }

        public async Task<UserProjection> GetUserProjectionById(String userId)
        {
            var project = new BsonDocument
            {
                { "_id", new BsonDocument("$toString", "$_id") },
                { "name", 1 },
                { "roomId", 1 },
            };
            return await _usersCollection
                .Find(Builders<User>.Filter.Eq("_id", ObjectId.Parse(userId)))
                .Project<UserProjection>(project)
                .FirstOrDefaultAsync();
        }

        public async Task<String> GetRoomId(string userId)
        {
            var user = await _usersCollection
                .Find(Builders<User>.Filter.Eq("_id", ObjectId.Parse(userId)))
                .FirstOrDefaultAsync();

            return user.RoomId;
        }
    }
}
