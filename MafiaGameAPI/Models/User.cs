using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MafiaGameAPI.Models
{
    public class User
    {
        [BsonId]
        public ObjectId Id { get; set; }
        public string Name { get; set; }
        public string RoomId { get; set; }
    }
}
